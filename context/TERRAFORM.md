# Terraform Infrastructure Guide

This document provides a comprehensive guide for creating production-grade AWS infrastructure using Terraform. It covers the architecture patterns, coding conventions, and infrastructure components used in the Nolan Technologies platform.

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Coding Conventions & Style Guide](#coding-conventions--style-guide)
4. [Core Infrastructure Components](#core-infrastructure-components)
5. [Complete Code Reference](#complete-code-reference)
6. [Extending for Different Projects](#extending-for-different-projects)

---

## Overview

This infrastructure setup creates a production-ready AWS environment with:

- **VPC** with public and private subnets across multiple availability zones
- **NAT Gateways** for secure outbound internet access from private subnets
- **AWS App Runner** services for containerized application deployment
- **IAM Roles and Policies** for secure access to AWS Secrets Manager
- **VPC Connectors** to allow App Runner services to access VPC resources

### Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│                          AWS VPC (10.0.0.0/16)                  │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────┐          │
│  │  Public Subnet 1    │      │  Public Subnet 2    │          │
│  │  (10.0.0.0/24)      │      │  (10.0.1.0/24)      │          │
│  │  AZ: us-east-2a     │      │  AZ: us-east-2b     │          │
│  │                     │      │                     │          │
│  │  ┌───────────────┐  │      │  ┌───────────────┐  │          │
│  │  │ NAT Gateway 1 │  │      │  │ NAT Gateway 2 │  │          │
│  │  └───────────────┘  │      │  └───────────────┘  │          │
│  └─────────────────────┘      └─────────────────────┘          │
│            │                            │                       │
│            ▼                            ▼                       │
│  ┌─────────────────────┐      ┌─────────────────────┐          │
│  │  Private Subnet 1   │      │  Private Subnet 2   │          │
│  │  (10.0.2.0/24)      │      │  (10.0.3.0/24)      │          │
│  │  AZ: us-east-2a     │      │  AZ: us-east-2b     │          │
│  └─────────────────────┘      └─────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              App Runner VPC Connector                    │   │
│  │     (Connects App Runner services to private subnets)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Internet Gateway│
                    └─────────────────┘
                              │
                              ▼
                         Internet
```

---

## File Structure

Organize Terraform files by environment and concern:

```
infrastructure/
├── environments/
│   ├── prod/
│   │   ├── main.tf              # Core infrastructure (VPC, subnets, gateways, routes)
│   │   ├── app_runner.tf        # App Runner services and connections
│   │   ├── app_runner_role.tf   # IAM roles and policies for App Runner
│   │   └── variables.tf         # Environment-specific variables
│   └── staging/
│       ├── main.tf
│       ├── app_runner.tf
│       ├── app_runner_role.tf
│       └── variables.tf
├── providers.tf                 # Shared provider configurations
├── variables.tf                 # Shared variables
└── README.md
```

### File Responsibilities

| File | Purpose |
|------|---------|
| `main.tf` | Core networking infrastructure (VPC, subnets, gateways, route tables) |
| `app_runner.tf` | Application deployment resources (App Runner services, VPC connectors) |
| `app_runner_role.tf` | IAM roles and policies for service permissions |
| `variables.tf` | Input variables for the environment |
| `providers.tf` | AWS and other provider configurations |

---

## Coding Conventions & Style Guide

### 1. Section Separators

Use visual separators to organize logical sections within files:

```hcl
###############################################################################
###############################################################################
# Section Name ################################################################
###############################################################################
###############################################################################
```

This creates clear visual breaks between major infrastructure components.

### 2. Resource Naming Convention

Follow the pattern: `{environment}-{project}-{resource-type}[-{qualifier}]`

Examples:
- `prod-nolan-vpc`
- `prod-nolan-public-subnet-one`
- `prod-nolan-nat-gateway-two`

### 3. Commenting Style

**Every resource block should have:**
- A comment above describing its purpose
- Inline comments for each significant property

```hcl
# define a resource for an AWS VPC, named "prod-nolan-vpc"
resource "aws_vpc" "prod-nolan-vpc" {

  # set the IP address range for the VPC using CIDR notation
  cidr_block = "10.0.0.0/16"

  # enable DNS support within the VPC
  enable_dns_support = true

  # enable assignment of DNS hostnames to instances in the VPC
  enable_dns_hostnames = true

  # tag the VPC with the name for identification
  tags = {
    Name = "prod-nolan-vpc"
  }
}
```

### 4. Block Organization

Within each resource, organize properties in this order:
1. Core/required properties
2. Configuration blocks
3. Dependencies (`depends_on`)
4. Tags

### 5. Tag Standards

Always include at minimum a `Name` tag. Consider adding:
- `environment` - prod, staging, dev
- `project` - project identifier
- `managed_by` - "terraform"

```hcl
tags = {
  Name        = "resource-name"
  environment = var.environment
  project     = "nolan"
  managed_by  = "terraform"
}
```

### 6. Variable Usage

Use variables for values that change between environments:

```hcl
variable "environment" {
  type    = string
  default = "prod"
}
```

---

## Core Infrastructure Components

### 1. Terraform Configuration Block

Configure Terraform version requirements and backend:

```hcl
terraform {
  required_version = ">=1.1.0"

  cloud {
    organization = "your-organization"

    workspaces {
      name = "workspace-name"
    }
  }
}
```

### 2. Provider Configuration

```hcl
provider "aws" {
  region = "us-east-2"
}

provider "random" {
}
```

### 3. VPC (Virtual Private Cloud)

The foundation of your network infrastructure:

```hcl
resource "aws_vpc" "prod-nolan-vpc" {
  cidr_block           = "10.0.0.0/16"  # 65,536 IP addresses
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "prod-nolan-vpc"
  }
}
```

### 4. Subnets

Create both public and private subnets across multiple availability zones:

**Public Subnets** - For resources that need direct internet access (NAT gateways, load balancers)

**Private Subnets** - For application workloads that should not be directly accessible from the internet

### 5. Internet Gateway

Enables internet connectivity for public subnets:

```hcl
resource "aws_internet_gateway" "prod-nolan-internet-gateway" {
  tags = {
    Name = "prod-nolan-internet-gateway"
  }
}

resource "aws_internet_gateway_attachment" "prod-nolan-internet-gateway-attachment" {
  internet_gateway_id = aws_internet_gateway.prod-nolan-internet-gateway.id
  vpc_id              = aws_vpc.prod-nolan-vpc.id
}
```

### 6. NAT Gateways

Allow private subnet resources to access the internet while remaining inaccessible from outside:

```hcl
resource "aws_eip" "prod-nolan-elastic-ip-one" {
  vpc = true
  tags = {
    Name = "prod-nolan-elastic-ip-one"
  }
}

resource "aws_nat_gateway" "prod-nolan-nat-gateway-one" {
  allocation_id = aws_eip.prod-nolan-elastic-ip-one.id
  subnet_id     = aws_subnet.prod-nolan-public-subnet-one.id

  depends_on = [
    aws_subnet.prod-nolan-public-subnet-one,
    aws_eip.prod-nolan-elastic-ip-one
  ]

  tags = {
    Name = "prod-nolan-nat-gateway-one"
  }
}
```

### 7. Route Tables

Control traffic flow within your VPC:

**Public Route Table** - Routes traffic to Internet Gateway
**Private Route Table** - Routes traffic through NAT Gateway

### 8. App Runner Services

Deploy containerized applications:

```hcl
resource "aws_apprunner_service" "prod" {
  service_name = "prod_gateway_service"

  source_configuration {
    authentication_configuration {
      connection_arn = aws_apprunner_connection.apprunner-github-connection.arn
    }

    code_repository {
      code_configuration {
        code_configuration_values {
          port          = "3014"
          runtime       = "NODEJS_16"
          build_command = "npm install -g typescript && npm i && rm -rf dist/ && npx tsc"
          start_command = "npm start"

          runtime_environment_secrets = {
            "SECRET_ENV": "arn:aws:secretsmanager:region:account:secret:path"
          }
        }
        configuration_source = "API"
      }

      repository_url = "https://github.com/org/repo"

      source_code_version {
        type  = "BRANCH"
        value = "main"
      }
    }
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.prod-nolan-vpc.arn
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.prod_app_runner_role.arn
  }

  tags = {
    Name = "prod_gateway_service"
  }
}
```

### 9. IAM Roles and Policies

Secure access to AWS services:

```hcl
resource "aws_iam_role" "prod_app_runner_role" {
  name               = "prod_app_runner_role"
  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "tasks.apprunner.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "prod_secrets_manager_policy" {
  name        = "prod_secrets_manager_policy"
  description = "IAM policy that allows access to secrets with 'prod/' prefix"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:ListSecrets"
            ],
            "Resource": "arn:aws:secretsmanager:*:*:secret:prod/*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "secrets_manager_policy_attachment" {
  role       = aws_iam_role.prod_app_runner_role.name
  policy_arn = aws_iam_policy.prod_secrets_manager_policy.arn
}
```

---

## Complete Code Reference

### variables.tf

```hcl
variable "environment" {
  type    = string
  default = "prod"
}
```

### main.tf

```hcl
# define the `terraform` block which contains Terraform settings
terraform {

  # set the minimum required version of Terraform for this configuration to 1.1.0 or newer
  required_version = ">=1.1.0"

  # define a `cloud` block to configure the integration with Terraform Cloud
  cloud {

    # set the name of the `organization` in Terraform Cloud
    organization = "nolan-technologies"

    # define a `workspaces` block to configure workspace settings within the specified organization
    workspaces {

      # set the name of the workspace in Terraform Cloud
      name = "nolan-infrastructure-prod"
    }
  }
}

###############################################################################
###############################################################################
# Providers ###################################################################
###############################################################################
###############################################################################

# define the AWS provider to manage infrastructure in AWS
provider "aws" {

  # set the `region` as "us-east-2" (US East, Ohio) for AWS resources
  region = "us-east-2"
}

# define the "random" provider for generating random values or IDs
provider "random" {
}

###############################################################################
###############################################################################
# VPC #########################################################################
###############################################################################
###############################################################################

# define a resource for an AWS VPC, named "prod-nolan-vpc"
resource "aws_vpc" "prod-nolan-vpc" {

  # set the IP address range for the VPC using CIDR notation allowing for 65,536 IP addresses within the VPC
  cidr_block = "10.0.0.0/16"

  # enable DNS support within the VPC
  enable_dns_support = true

  # enable assignment of DNS hostnames to instances in the VPC
  enable_dns_hostnames = true

  # tag the VPC with the name "prod-nolan-vpc" for identification
  tags = {
    Name  = "prod-nolan-vpc"
  }
}

###############################################################################
###############################################################################
# Subnets #####################################################################
###############################################################################
###############################################################################

# define a resource for an AWS subnet, named "prod-nolan-public-subnet-one"
resource "aws_subnet" "prod-nolan-public-subnet-one" {

  # associate this subnet with the VPC identified by "prod-nolan-vpc"
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = "10.0.0.0/24"

  # set the subnet's placement in the 'us-east-2a' availability zone
  availability_zone = "us-east-2a"

  # tag the subnet with the name "prod-nolan-public-subnet-one" for identification  
  tags = {
    Name  = "prod-nolan-public-subnet-one"
  }
}

# define a resource for an AWS subnet, named "prod-nolan-public-subnet-two" 
resource "aws_subnet" "prod-nolan-public-subnet-two" {

  # associate this subnet with the VPC identified by "prod-nolan-vpc"
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = "10.0.1.0/24"

  # set the subnet's placement in the 'us-east-2b' availability zone
  availability_zone = "us-east-2b"

  # tag the subnet with the name "prod-nolan-public-subnet-two" for identification
  tags = {
    Name  = "prod-nolan-public-subnet-two"
  }
}

# define a resource for an AWS subnet, named "prod-nolan-private-subnet-one"
resource "aws_subnet" "prod-nolan-private-subnet-one" {

  # associate this subnet with the VPC identified by "prod-nolan-vpc"
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet 
  cidr_block = "10.0.2.0/24"

  # set the subnet's placement in the 'us-east-2a' availability zone
  availability_zone = "us-east-2a"

  # tag the subnet with the name "prod-nolan-private-subnet-one" for identification
  tags = {
    Name  = "prod-nolan-private-subnet-one"
  }
}

# define a resource for an AWS subnet, named "prod-nolan-private-subnet-two"
resource "aws_subnet" "prod-nolan-private-subnet-two" {

  # associate this subnet with the VPC identified by "prod-nolan-vpc"
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet 
  cidr_block = "10.0.3.0/24"

  # set the subnet's placement in the 'us-east-2b' availability zone
  availability_zone = "us-east-2b"

  # tag the subnet with the name "prod-nolan-private-subnet-two" for identification
  tags = {
    Name  = "prod-nolan-private-subnet-two"
  }
}

# define a resource for an AWS Database Subnet Group, named "prod-nolan-vpc-private-subnet-group"
resource "aws_db_subnet_group" "prod-nolan-vpc-private-subnet-group" {

  # set the name of the DB subnet group to "prod-nolan-vpc-private-subnet-group"
  name = "prod-nolan-vpc-private-subnet-group"

  // set the subnet IDs to include in this DB subnet group, referencing the two private subnets
  subnet_ids = [
    aws_subnet.prod-nolan-private-subnet-one.id
    , aws_subnet.prod-nolan-private-subnet-two.id
  ]

  # tag the DB subnet group with an environment the name "prod-nolan-vpc-private-subnet-group" for identification
  tags = {
    Name        = "prod-nolan-vpc-private-subnet-group"
    environment = var.environment
  }
}

###############################################################################
###############################################################################
# Elastic IPs #################################################################
###############################################################################
###############################################################################

# define a resource for an AWS Elastic IP, named "prod-nolan-elastic-ip-one" to attach to a NAT gateway
resource "aws_eip" "prod-nolan-elastic-ip-one" {

  // enable the Elastic IP to be used with a VPC
  vpc = true

  # tag the elastic IP with the name "prod-nolan-elastic-ip-one" for identification
  tags = {
    Name  = "prod-nolan-elastic-ip-one"
  }
}

# define a resource for an AWS Elastic IP, named "prod-nolan-elastic-ip-two" to attach to a NAT gateway
resource "aws_eip" "prod-nolan-elastic-ip-two" {

  // enable the Elastic IP to be used with a VPC
  vpc = true

  # tag the elastic IP with the name "prod-nolan-elastic-ip-two" for identification
  tags = {
    Name  = "prod-nolan-elastic-ip-two"
  }
}

###############################################################################
###############################################################################
# Internet Gateway ############################################################
###############################################################################
###############################################################################

# define a resource for an AWS internet gateway, named "prod-nolan-internet-gateway" to enables communication between the VPC and the internet
resource "aws_internet_gateway" "prod-nolan-internet-gateway" {

  # tag the internet gateway with the name "prod-nolan-internet-gateway" for identification
  tags = {
    Name  = "prod-nolan-internet-gateway"
  }
}

# define a resource to attach an internet gateway to a VPC, named "prod-nolan-internet-gateway-attachment"
resource "aws_internet_gateway_attachment" "prod-nolan-internet-gateway-attachment" {

  # set the ID of the internet gateway to be attached, referencing the "prod-nolan-internet-gateway"
  internet_gateway_id = aws_internet_gateway.prod-nolan-internet-gateway.id

  # set the ID of the VPC to which the internet gateway will be attached, referencing "prod-nolan-vpc"
  vpc_id = aws_vpc.prod-nolan-vpc.id
}

###############################################################################
###############################################################################
# NAT Gateways ################################################################
###############################################################################
###############################################################################

# define an AWS NAT Gateway resource, named "prod-nolan-nat-gateway-one"
resource "aws_nat_gateway" "prod-nolan-nat-gateway-one" {

  # set the Elastic IP allocation ID to associate with the NAT Gateway, referencing the EIP "prod-nolan-elastic-ip-one"
  allocation_id = aws_eip.prod-nolan-elastic-ip-one.id

  # set the subnet where the NAT Gateway will reside, referencing "prod-nolan-public-subnet-one"
  subnet_id = aws_subnet.prod-nolan-public-subnet-one.id

  # ensure the NAT Gateway is created only after the specified subnet and EIP are created and available
  depends_on = [
    aws_subnet.prod-nolan-public-subnet-one,
    aws_eip.prod-nolan-elastic-ip-one
  ]

  # tag the NAT gateway with the name "nolan-nat-gateway-one" for identification
  tags = {
    Name  = "prod-nolan-nat-gateway-one"
  }
}

# define an AWS NAT Gateway resource, named "prod-nolan-nat-gateway-two"
resource "aws_nat_gateway" "prod-nolan-nat-gateway-two" {

  # set the Elastic IP allocation ID to associate with the NAT Gateway, referencing the EIP "prod-nolan-elastic-ip-two"
  allocation_id = aws_eip.prod-nolan-elastic-ip-two.id

  # set the subnet where the NAT Gateway will reside, referencing "prod-nolan-public-subnet-two"
  subnet_id     = aws_subnet.prod-nolan-public-subnet-two.id

  # ensure the NAT Gateway is created only after the specified subnet and EIP are created and available
  depends_on = [
    aws_subnet.prod-nolan-public-subnet-two,
    aws_eip.prod-nolan-elastic-ip-two
  ]

  # tag the NAT gateway with the name "nolan-nat-gateway-two" for identification
  tags = {
    Name  = "prod-nolan-nat-gateway-two"
  }
}

###############################################################################
###############################################################################
# Route Tables ################################################################
###############################################################################
###############################################################################

# define an AWS route table resource, named "prod-nolan-route-table-public-one"
resource "aws_route_table" "prod-nolan-route-table-public-one" {

  # associate this route table with the "prod-nolan-vpc" VPC by referencing its ID
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # define a `route` block to configure route rules
  route {

    # specify a route rule for all traffic as 0.0.0.0/0 represents all IP addresses
    cidr_block = "0.0.0.0/0"

    # route to the "prod-nolan-internet-gateway", enabling internet access for the subnet
    gateway_id = aws_internet_gateway.prod-nolan-internet-gateway.id
  }

  # ensure the route table is created only after the specified VPC is created and available
  depends_on = [
    aws_vpc.prod-nolan-vpc
  ]

  # tag the route table with the name "nolan-route-table-public-one" for identification
  tags = {
    Name  = "prod-nolan-route-table-public-one"
  }
}

# define a resource for associating a route table with a subnet, named "prod-nolan-route-table-public-one-association"
resource "aws_route_table_association" "prod-nolan-route-table-public-one-assoication" {

  # set the ID of the subnet ("prod-nolan-public-subnet-one") to be associated with the route table
  subnet_id = aws_subnet.prod-nolan-public-subnet-one.id

  # set the ID of the route table ("prod-nolan-route-table-public-one") to be associated with the subnet
  route_table_id = aws_route_table.prod-nolan-route-table-public-one.id

  # ensure that the association is created only after both the specified route table and subnet are created and available
  depends_on = [
    aws_route_table.prod-nolan-route-table-public-one,
    aws_subnet.prod-nolan-public-subnet-one
  ]
}

# define an AWS route table resource, named "prod-nolan-route-table-public-two"
resource "aws_route_table" "prod-nolan-route-table-public-two" {

  # associate this route table with the "prod-nolan-vpc" VPC by referencing its ID
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # define a `route` block to configure route rules
  route {

    # specify a route rule for all traffic as 0.0.0.0/0 represents all IP addresses
    cidr_block = "0.0.0.0/0"

    # route to the "prod-nolan-internet-gateway", enabling internet access for the subnet
    gateway_id = aws_internet_gateway.prod-nolan-internet-gateway.id
  }

  # ensure the route table is created only after the specified VPC is created and available
  depends_on = [
    aws_vpc.prod-nolan-vpc
  ]

  # tag the route table with the name "prod-nolan-route-table-public-two" for identification
  tags = {
    Name  = "prod-nolan-route-table-public-two"
  }
}

# define a resource for associating a route table with a subnet, named "prod-nolan-route-table-public-two-association"
resource "aws_route_table_association" "prod-nolan-route-table-public-two-assoication" {

  # set the ID of the subnet ("prod-nolan-public-subnet-two") to be associated with the route table
  subnet_id = aws_subnet.prod-nolan-public-subnet-two.id

  # set the ID of the route table ("prod-nolan-route-table-public-two") to be associated with the subnet
  route_table_id = aws_route_table.prod-nolan-route-table-public-two.id

  # ensure that the association is created only after both the specified route table and subnet are created and available
  depends_on = [
    aws_route_table.prod-nolan-route-table-public-two,
    aws_subnet.prod-nolan-public-subnet-two
  ]
}

# define an AWS route table resource, named "prod-nolan-route-table-private-one"
resource "aws_route_table" "prod-nolan-route-table-private-one" {

  # associate this route table with the "prod-nolan-vpc" VPC by referencing its ID
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # define a `route` block to configure route rules
  route {

    # specify a route rule for all traffic as 0.0.0.0/0 represents all IP addresses
    cidr_block = "0.0.0.0/0"

    # route through the NAT gateway named "prod-nolan-nat-gateway-one"
    nat_gateway_id = aws_nat_gateway.prod-nolan-nat-gateway-one.id
  }

  # ensure the route table is created only after the specified VPC is created and available
  depends_on = [
    aws_vpc.prod-nolan-vpc
  ]

  # tag the route table with the name "prod-nolan-route-table-private-one" for identification
  tags = {
    Name  = "prod-nolan-route-table-private-one"
  }
}

# define a resource for associating a route table with a subnet, named "prod-nolan-route-table-private-one-association"
resource "aws_route_table_association" "prod-nolan-route-table-private-one-assoication" {

  # set the ID of the subnet ("prod-nolan-private-subnet-one") to be associated with the route table
  subnet_id = aws_subnet.prod-nolan-private-subnet-one.id

  # set the ID of the route table ("prod-nolan-route-table-private-one") to be associated with the subnet
  route_table_id = aws_route_table.prod-nolan-route-table-private-one.id

  # ensure that the association is created only after both the specified route table and subnet are created and available
  depends_on = [
    aws_route_table.prod-nolan-route-table-private-one,
    aws_subnet.prod-nolan-private-subnet-one
  ]
}

# define an AWS route table resource, named "prod-nolan-route-table-private-two"
resource "aws_route_table" "prod-nolan-route-table-private-two" {

  # associate this route table with the "prod-nolan-vpc" VPC by referencing its ID
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # define a `route` block to configure route rules
  route {

    # specify a route rule for all traffic as 0.0.0.0/0 represents all IP addresses
    cidr_block = "0.0.0.0/0"

    # route through the NAT gateway named "prod-nolan-nat-gateway-two"
    nat_gateway_id = aws_nat_gateway.prod-nolan-nat-gateway-two.id
  }

  # ensure the route table is created only after the specified VPC is created and available
  depends_on = [
    aws_vpc.prod-nolan-vpc
  ]

  # tag the route table with the name "prod-nolan-route-table-private-two" for identification
  tags = {
    Name  = "prod-nolan-route-table-private-two"
  }
}

# define a resource for associating a route table with a subnet, named "prod-nolan-route-table-private-two-association"
resource "aws_route_table_association" "prod-nolan-route-table-private-two-assoication" {

  # set the ID of the subnet ("prod-nolan-private-subnet-two") to be associated with the route table
  subnet_id      = aws_subnet.prod-nolan-private-subnet-two.id

  # set the ID of the route table ("prod-nolan-route-table-priavte-two") to be associated with the subnet
  route_table_id = aws_route_table.prod-nolan-route-table-private-two.id

  # ensure that the association is created only after both the specified route table and subnet are created and available
  depends_on = [
    aws_route_table.prod-nolan-route-table-private-two,
    aws_subnet.prod-nolan-private-subnet-two
  ]
}
```

### app_runner_role.tf

```hcl
resource "aws_iam_role" "prod_app_runner_role" {
    name               = "prod_app_runner_role"
    assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "tasks.apprunner.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "prod_secrets_manager_policy" {
    name        = "prod_secrets_manager_policy"
    description = "IAM policy that allows access to secrets with 'prod/' prefix"

    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:ListSecrets"
            ],
            "Resource": "arn:aws:secretsmanager:*:*:secret:prod/*"
        }
    ]
}
EOF
}

// attach aws_iam_policy to aws_iam_role
resource "aws_iam_role_policy_attachment" "secrets_manager_policy_attachment" {
    role       = aws_iam_role.prod_app_runner_role.name
    policy_arn = aws_iam_policy.prod_secrets_manager_policy.arn
}
```

### app_runner.tf

```hcl
###############################################################################
###############################################################################
# AppRunner Connection ########################################################
###############################################################################
###############################################################################

# define a resource for an AWS App Runner connection named 'apprunner-connection-prod'
resource "aws_apprunner_connection" "apprunner-github-connection" {

  # set the name of the App Runner connection, used for identifying this specific connection
  connection_name = "apprunner-github-connection"

 # set the source control provider type for the connection
  provider_type = "GITHUB"

  # tag the connection with the name "apprunner-github-connection" for identification
  tags = {
    Name = "apprunner-github-connection"
  }
}

###############################################################################
###############################################################################
# VPC Security Group ##########################################################
###############################################################################
###############################################################################

data "aws_security_group" "default" {
  vpc_id = aws_vpc.prod-nolan-vpc.id
  name   = "default"
}

###############################################################################
###############################################################################
# VPC Connector ###############################################################
###############################################################################
###############################################################################

# define a resource for an AWS App Runner VPC connector named "prod-nolan-vpc"
resource "aws_apprunner_vpc_connector" "prod-nolan-vpc" {

  # set the name of the VPC connector, used for identifying this specific connector
  vpc_connector_name = "prod-nolan-vpc"

  # set the IDs of the subnets to be used by the VPC connector, enabling the App Runner service to access these subnets
  subnets = [aws_subnet.prod-nolan-private-subnet-one.id, aws_subnet.prod-nolan-private-subnet-two.id]

  # set the security group IDs to associate with the VPC connector
  security_groups = [data.aws_security_group.default.id]

  # tag the VPC connector with the name "prod-nolan-vpc" for identification
  tags = {
    Name = "prod-nolan-vpc"
  }
}

###############################################################################
###############################################################################
# AppRunner Services ##########################################################
###############################################################################
###############################################################################

# define a resource for an AWS App Runner service named "prod"
resource "aws_apprunner_service" "prod" {

  # set the name of the App Runner service for identification
  service_name = "prod_gateway_service"

  # define the `source_configuration` block which contains for the App Runner service, including the auth, repository, and runtime settings
  source_configuration {

    # define the `authentication_configuration` bloch which contains connection settings
    authentication_configuration {
      
      # set the ARN of the App Runner connection for accessing the source repository
      connection_arn = aws_apprunner_connection.apprunner-github-connection.arn
    }

    # define the `code_repository` block which configures the code repository from which App Runner will build and deploy the application
    code_repository {
    
      # define the code configuration settings for the application
      code_configuration {

        # set the code configuration values
        code_configuration_values {
          
          # set the application's listening port to 3014
          port = "3014"

          # set the runtime environment to Node.js version 16
          runtime = "NODEJS_16"

          # set the command app runner will use to build the application
          build_command = "npm install -g typescript && npm i && rm -rf dist/ && npx tsc"

          # set the command app runner will use to start the application
          start_command = "npm start"

          # set the runtime env vars
          runtime_environment_secrets = {
            "SECRET_ENV": "arn:aws:secretsmanager:us-east-2:010864823477:secret:prod/gateway/env-6zF2fz"
          }

        }

        # indicate that the configuration is specified in the source repository
        # configuration_source = "REPOSITORY"
        configuration_source = "API"
      }

      # set the URL of the GitHub repository containing the application code
      repository_url = "https://github.com/Nolan-Technologies/gateway-mm"

      # define a `source_code_version` block which identifies version of code that AWS App Runner refers to within a source code repository
      source_code_version {

        # set the type of source code version, in this case, a branch in the repository
        type  = "BRANCH"

        # set the target branch name to "main"
        value = "main-aws"
      }
    }
  }

  # define a `network_configuration` block which configures the network settings for the App Runner service
  network_configuration {

    # define an `egress_configuration` block which defines how the service accesses resources outside of App Runner
    egress_configuration {

      # set the egress type to "VPC", enabling the service to access resources within a VPC
      egress_type = "VPC"

      # set the ARN of the VPC connector to use for network egress
      vpc_connector_arn = aws_apprunner_vpc_connector.prod-nolan-vpc.arn
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.prod_app_runner_role.arn
  }

  # tag the App Runner service  with the name "prod_gateway_service" for identification
  tags = {
    Name = "prod_gateway_service"
  }
}

# define a resource for an AWS App Runner service named "prod_unit_service"
resource "aws_apprunner_service" "prod_unit_service" {

  # set the name of the App Runner service for identification
  service_name = "prod_unit_service"

  # define the `source_configuration` block which contains for the App Runner service, including the auth, repository, and runtime settings
  source_configuration {

    # define the `authentication_configuration` bloch which contains connection settings
    authentication_configuration {
      
      # set the ARN of the App Runner connection for accessing the source repository
      connection_arn = aws_apprunner_connection.apprunner-github-connection.arn
    }

    # define the `code_repository` block which configures the code repository from which App Runner will build and deploy the application
    code_repository {
    
      # define the code configuration settings for the application
      code_configuration {

        # set the code configuration values
        code_configuration_values {
          
          # set the application's listening port to 3014
          port = "3014"

          # set the runtime environment to Node.js version 16
          runtime = "NODEJS_16"

          # set the command app runner will use to build the application
          build_command = "npm install -g typescript && npm i && rm -rf dist/ && npx tsc"

          # set the command app runner will use to start the application
          start_command = "npm start"

          # set the runtime env vars
          runtime_environment_secrets = {
            "SECRET_ENV": "arn:aws:secretsmanager:us-east-2:010864823477:secret:prod/unit/env-8gZlAI"
          }
        }

        # indicate that the configuration is specified in the source repository
        # configuration_source = "REPOSITORY"
        configuration_source = "API"
      }

      # set the URL of the GitHub repository containing the application code
      repository_url = "https://github.com/Nolan-Technologies/unit-mm"

      # define a `source_code_version` block which identifies version of code that AWS App Runner refers to within a source code repository
      source_code_version {

        # set the type of source code version, in this case, a branch in the repository
        type  = "BRANCH"

        # set the target branch name to "main"
        value = "main-aws"
      }
    }
  }

  # define a `network_configuration` block which configures the network settings for the App Runner service
  network_configuration {

    # define an `egress_configuration` block which defines how the service accesses resources outside of App Runner
    egress_configuration {

      # set the egress type to "VPC", enabling the service to access resources within a VPC
      egress_type = "VPC"

      # set the ARN of the VPC connector to use for network egress
      vpc_connector_arn = aws_apprunner_vpc_connector.prod-nolan-vpc.arn
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.prod_app_runner_role.arn
  }

  # tag the App Runner service  with the name "prod_unit_service" for identification
  tags = {
    Name = "prod_unit_service"
  }
}
```

---

## Extending for Different Projects

### Adding a PostgreSQL RDS Database

To add a PostgreSQL database to this infrastructure, create a new file `database.tf`:

```hcl
###############################################################################
###############################################################################
# RDS PostgreSQL Database #####################################################
###############################################################################
###############################################################################

# define a resource for an AWS RDS PostgreSQL instance, named "prod-nolan-postgres"
resource "aws_db_instance" "prod-nolan-postgres" {

  # set the database instance identifier for identification
  identifier = "prod-nolan-postgres"

  # set the database engine to PostgreSQL
  engine         = "postgres"
  engine_version = "15.4"

  # set the instance class (size) for the database
  instance_class = "db.t3.micro"

  # set the allocated storage in gigabytes
  allocated_storage     = 20
  max_allocated_storage = 100

  # set the database name, username, and password
  db_name  = "nolan_prod"
  username = "nolan_admin"
  password = var.db_password  # Use a variable or Secrets Manager

  # place the database in the private subnet group
  db_subnet_group_name = aws_db_subnet_group.prod-nolan-vpc-private-subnet-group.name

  # associate with VPC security group
  vpc_security_group_ids = [aws_security_group.prod-nolan-postgres-sg.id]

  # disable public accessibility (database is only accessible within VPC)
  publicly_accessible = false

  # enable automated backups with 7-day retention
  backup_retention_period = 7

  # enable deletion protection for production
  deletion_protection = true

  # skip final snapshot when destroying (set to false for production)
  skip_final_snapshot = false
  final_snapshot_identifier = "prod-nolan-postgres-final-snapshot"

  # tag the database instance for identification
  tags = {
    Name        = "prod-nolan-postgres"
    environment = var.environment
  }
}

###############################################################################
###############################################################################
# Database Security Group #####################################################
###############################################################################
###############################################################################

# define a security group for the PostgreSQL database
resource "aws_security_group" "prod-nolan-postgres-sg" {

  # set the name and description of the security group
  name        = "prod-nolan-postgres-sg"
  description = "Security group for PostgreSQL database"

  # associate with the VPC
  vpc_id = aws_vpc.prod-nolan-vpc.id

  # allow inbound PostgreSQL traffic from the VPC CIDR block
  ingress {
    description = "PostgreSQL from VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.prod-nolan-vpc.cidr_block]
  }

  # allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # tag the security group for identification
  tags = {
    Name        = "prod-nolan-postgres-sg"
    environment = var.environment
  }
}

###############################################################################
###############################################################################
# Database Outputs ############################################################
###############################################################################
###############################################################################

# output the database endpoint for use by applications
output "database_endpoint" {
  description = "The connection endpoint for the PostgreSQL database"
  value       = aws_db_instance.prod-nolan-postgres.endpoint
}

output "database_port" {
  description = "The port the database is listening on"
  value       = aws_db_instance.prod-nolan-postgres.port
}
```

Update `variables.tf` to include the database password:

```hcl
variable "environment" {
  type    = string
  default = "prod"
}

variable "db_password" {
  type        = string
  description = "Password for the PostgreSQL database"
  sensitive   = true
}
```

Update the IAM policy to allow RDS access if needed:

```hcl
resource "aws_iam_policy" "prod_rds_policy" {
  name        = "prod_rds_policy"
  description = "IAM policy that allows RDS access"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "rds:DescribeDBInstances",
                "rds-db:connect"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "rds_policy_attachment" {
  role       = aws_iam_role.prod_app_runner_role.name
  policy_arn = aws_iam_policy.prod_rds_policy.arn
}
```

### Adding Redis/ElastiCache

```hcl
###############################################################################
###############################################################################
# ElastiCache Redis ###########################################################
###############################################################################
###############################################################################

# define a security group for Redis
resource "aws_security_group" "prod-nolan-redis-sg" {
  name        = "prod-nolan-redis-sg"
  description = "Security group for Redis"
  vpc_id      = aws_vpc.prod-nolan-vpc.id

  ingress {
    description = "Redis from VPC"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.prod-nolan-vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "prod-nolan-redis-sg"
  }
}

# define an ElastiCache subnet group
resource "aws_elasticache_subnet_group" "prod-nolan-redis-subnet-group" {
  name       = "prod-nolan-redis-subnet-group"
  subnet_ids = [
    aws_subnet.prod-nolan-private-subnet-one.id,
    aws_subnet.prod-nolan-private-subnet-two.id
  ]
}

# define an ElastiCache Redis cluster
resource "aws_elasticache_cluster" "prod-nolan-redis" {
  cluster_id           = "prod-nolan-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  subnet_group_name    = aws_elasticache_subnet_group.prod-nolan-redis-subnet-group.name
  security_group_ids   = [aws_security_group.prod-nolan-redis-sg.id]

  tags = {
    Name        = "prod-nolan-redis"
    environment = var.environment
  }
}
```

### Adding S3 Bucket for File Storage

```hcl
###############################################################################
###############################################################################
# S3 Bucket ###################################################################
###############################################################################
###############################################################################

# define an S3 bucket for file storage
resource "aws_s3_bucket" "prod-nolan-files" {
  bucket = "prod-nolan-files-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "prod-nolan-files"
    environment = var.environment
  }
}

# generate a random suffix for bucket name uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# block public access to the bucket
resource "aws_s3_bucket_public_access_block" "prod-nolan-files-public-access-block" {
  bucket = aws_s3_bucket.prod-nolan-files.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# add S3 permissions to the App Runner role
resource "aws_iam_policy" "prod_s3_policy" {
  name        = "prod_s3_policy"
  description = "IAM policy that allows S3 access"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "${aws_s3_bucket.prod-nolan-files.arn}",
                "${aws_s3_bucket.prod-nolan-files.arn}/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.prod_app_runner_role.name
  policy_arn = aws_iam_policy.prod_s3_policy.arn
}
```

---

## Deployment Checklist

Before deploying infrastructure, verify:

- [ ] All resource names follow the naming convention
- [ ] All resources have appropriate tags
- [ ] Sensitive values use variables or Secrets Manager (never hardcode)
- [ ] Private subnets are used for application workloads
- [ ] Security groups follow least privilege principle
- [ ] NAT Gateways are in place for outbound internet access
- [ ] Route tables are correctly associated with subnets
- [ ] IAM policies follow least privilege principle
- [ ] Terraform state is stored remotely (Terraform Cloud, S3, etc.)

## Commands Reference

```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure (use with caution!)
terraform destroy
```

---

## Best Practices Summary

1. **Use environments** - Separate staging and production configurations
2. **Comment thoroughly** - Every resource and property should be documented
3. **Use visual separators** - Group related resources with section headers
4. **Tag everything** - Use consistent tags for identification and cost tracking
5. **Use variables** - Externalize environment-specific values
6. **Least privilege** - IAM policies should grant minimum required permissions
7. **Multi-AZ** - Deploy across multiple availability zones for high availability
8. **Private subnets** - Run workloads in private subnets, use NAT for outbound
9. **Version control** - Track all infrastructure changes in Git
10. **Remote state** - Store Terraform state in a remote backend
