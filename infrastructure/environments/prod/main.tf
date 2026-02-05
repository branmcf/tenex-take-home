###############################################################################
###############################################################################
# Terraform Configuration #####################################################
###############################################################################
###############################################################################

# define the `terraform` block which contains Terraform settings
terraform {

  # set the minimum required version of Terraform for this configuration to 1.1.0 or newer
  required_version = ">=1.1.0"

  # specify required providers and their versions
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # define a `cloud` block to configure the integration with Terraform Cloud
  # uncomment and configure when ready to use Terraform Cloud
  # cloud {
  #   organization = "your-organization"
  #   workspaces {
  #     name = "tenex-infrastructure-prod"
  #   }
  # }
}

###############################################################################
###############################################################################
# Providers ###################################################################
###############################################################################
###############################################################################

# define the AWS provider to manage infrastructure in AWS
provider "aws" {

  # set the `region` from variable for AWS resources
  region = var.aws_region

  # default tags applied to all resources
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  }
}

# define the "random" provider for generating random values or IDs
provider "random" {
}

###############################################################################
###############################################################################
# VPC #########################################################################
###############################################################################
###############################################################################

# define a resource for an AWS VPC, named "prod-tenex-vpc"
resource "aws_vpc" "main" {

  # set the IP address range for the VPC using CIDR notation allowing for 65,536 IP addresses within the VPC
  cidr_block = var.vpc_cidr

  # enable DNS support within the VPC
  enable_dns_support = true

  # enable assignment of DNS hostnames to instances in the VPC
  enable_dns_hostnames = true

  # tag the VPC with the name for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-vpc"
  }
}

###############################################################################
###############################################################################
# Subnets #####################################################################
###############################################################################
###############################################################################

# define a resource for an AWS subnet, named "prod-tenex-public-subnet-one"
resource "aws_subnet" "public_one" {

  # associate this subnet with the VPC
  vpc_id = aws_vpc.main.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = var.public_subnet_one_cidr

  # set the subnet's placement in the first availability zone
  availability_zone = var.availability_zone_one

  # enable auto-assign public IP for instances in this public subnet
  map_public_ip_on_launch = true

  # tag the subnet for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-public-subnet-one"
    Type = "public"
  }
}

# define a resource for an AWS subnet, named "prod-tenex-public-subnet-two"
resource "aws_subnet" "public_two" {

  # associate this subnet with the VPC
  vpc_id = aws_vpc.main.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = var.public_subnet_two_cidr

  # set the subnet's placement in the second availability zone
  availability_zone = var.availability_zone_two

  # enable auto-assign public IP for instances in this public subnet
  map_public_ip_on_launch = true

  # tag the subnet for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-public-subnet-two"
    Type = "public"
  }
}

# define a resource for an AWS subnet, named "prod-tenex-private-subnet-one"
resource "aws_subnet" "private_one" {

  # associate this subnet with the VPC
  vpc_id = aws_vpc.main.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = var.private_subnet_one_cidr

  # set the subnet's placement in the first availability zone
  availability_zone = var.availability_zone_one

  # tag the subnet for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-private-subnet-one"
    Type = "private"
  }
}

# define a resource for an AWS subnet, named "prod-tenex-private-subnet-two"
resource "aws_subnet" "private_two" {

  # associate this subnet with the VPC
  vpc_id = aws_vpc.main.id

  # set the subnet's IP address range, allowing for 256 addresses within this subnet
  cidr_block = var.private_subnet_two_cidr

  # set the subnet's placement in the second availability zone
  availability_zone = var.availability_zone_two

  # tag the subnet for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-private-subnet-two"
    Type = "private"
  }
}

# define a resource for an AWS Database Subnet Group for RDS
resource "aws_db_subnet_group" "main" {

  # set the name of the DB subnet group
  name = "${var.environment}-${var.project_name}-db-subnet-group"

  # set the subnet IDs to include in this DB subnet group, referencing the two private subnets
  subnet_ids = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  # tag the DB subnet group for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-db-subnet-group"
  }
}

###############################################################################
###############################################################################
# Elastic IPs #################################################################
###############################################################################
###############################################################################

# define a resource for an AWS Elastic IP to attach to NAT gateway one
resource "aws_eip" "nat_one" {

  # enable the Elastic IP to be used with a VPC
  domain = "vpc"

  # tag the elastic IP for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-elastic-ip-one"
  }

  # ensure VPC is created first
  depends_on = [aws_internet_gateway.main]
}

# define a resource for an AWS Elastic IP to attach to NAT gateway two
resource "aws_eip" "nat_two" {

  # enable the Elastic IP to be used with a VPC
  domain = "vpc"

  # tag the elastic IP for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-elastic-ip-two"
  }

  # ensure VPC is created first
  depends_on = [aws_internet_gateway.main]
}

###############################################################################
###############################################################################
# Internet Gateway ############################################################
###############################################################################
###############################################################################

# define a resource for an AWS internet gateway to enable communication between the VPC and the internet
resource "aws_internet_gateway" "main" {

  # attach the internet gateway to the VPC
  vpc_id = aws_vpc.main.id

  # tag the internet gateway for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-internet-gateway"
  }
}

###############################################################################
###############################################################################
# NAT Gateways ################################################################
###############################################################################
###############################################################################

# define an AWS NAT Gateway resource for the first availability zone
resource "aws_nat_gateway" "one" {

  # set the Elastic IP allocation ID to associate with the NAT Gateway
  allocation_id = aws_eip.nat_one.id

  # set the subnet where the NAT Gateway will reside
  subnet_id = aws_subnet.public_one.id

  # ensure the NAT Gateway is created only after the specified subnet and EIP are created and available
  depends_on = [
    aws_subnet.public_one,
    aws_eip.nat_one,
    aws_internet_gateway.main
  ]

  # tag the NAT gateway for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-nat-gateway-one"
  }
}

# define an AWS NAT Gateway resource for the second availability zone
resource "aws_nat_gateway" "two" {

  # set the Elastic IP allocation ID to associate with the NAT Gateway
  allocation_id = aws_eip.nat_two.id

  # set the subnet where the NAT Gateway will reside
  subnet_id = aws_subnet.public_two.id

  # ensure the NAT Gateway is created only after the specified subnet and EIP are created and available
  depends_on = [
    aws_subnet.public_two,
    aws_eip.nat_two,
    aws_internet_gateway.main
  ]

  # tag the NAT gateway for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-nat-gateway-two"
  }
}

###############################################################################
###############################################################################
# Route Tables ################################################################
###############################################################################
###############################################################################

# define an AWS route table resource for public subnets
resource "aws_route_table" "public" {

  # associate this route table with the VPC
  vpc_id = aws_vpc.main.id

  # define a route rule for all internet-bound traffic
  route {

    # specify a route rule for all traffic (0.0.0.0/0 represents all IP addresses)
    cidr_block = "0.0.0.0/0"

    # route to the internet gateway, enabling internet access for the subnet
    gateway_id = aws_internet_gateway.main.id
  }

  # ensure the route table is created only after the VPC and internet gateway are available
  depends_on = [
    aws_vpc.main,
    aws_internet_gateway.main
  ]

  # tag the route table for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-route-table-public"
  }
}

# define a resource for associating the public route table with public subnet one
resource "aws_route_table_association" "public_one" {

  # set the ID of the subnet to be associated with the route table
  subnet_id = aws_subnet.public_one.id

  # set the ID of the route table to be associated with the subnet
  route_table_id = aws_route_table.public.id
}

# define a resource for associating the public route table with public subnet two
resource "aws_route_table_association" "public_two" {

  # set the ID of the subnet to be associated with the route table
  subnet_id = aws_subnet.public_two.id

  # set the ID of the route table to be associated with the subnet
  route_table_id = aws_route_table.public.id
}

# define an AWS route table resource for private subnet one
resource "aws_route_table" "private_one" {

  # associate this route table with the VPC
  vpc_id = aws_vpc.main.id

  # define a route rule for all outbound traffic through NAT gateway
  route {

    # specify a route rule for all traffic
    cidr_block = "0.0.0.0/0"

    # route through the NAT gateway for outbound internet access
    nat_gateway_id = aws_nat_gateway.one.id
  }

  # ensure the route table is created only after dependencies are available
  depends_on = [
    aws_vpc.main,
    aws_nat_gateway.one
  ]

  # tag the route table for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-route-table-private-one"
  }
}

# define a resource for associating the private route table with private subnet one
resource "aws_route_table_association" "private_one" {

  # set the ID of the subnet to be associated with the route table
  subnet_id = aws_subnet.private_one.id

  # set the ID of the route table to be associated with the subnet
  route_table_id = aws_route_table.private_one.id
}

# define an AWS route table resource for private subnet two
resource "aws_route_table" "private_two" {

  # associate this route table with the VPC
  vpc_id = aws_vpc.main.id

  # define a route rule for all outbound traffic through NAT gateway
  route {

    # specify a route rule for all traffic
    cidr_block = "0.0.0.0/0"

    # route through the NAT gateway for outbound internet access
    nat_gateway_id = aws_nat_gateway.two.id
  }

  # ensure the route table is created only after dependencies are available
  depends_on = [
    aws_vpc.main,
    aws_nat_gateway.two
  ]

  # tag the route table for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-route-table-private-two"
  }
}

# define a resource for associating the private route table with private subnet two
resource "aws_route_table_association" "private_two" {

  # set the ID of the subnet to be associated with the route table
  subnet_id = aws_subnet.private_two.id

  # set the ID of the route table to be associated with the subnet
  route_table_id = aws_route_table.private_two.id
}
