###############################################################################
###############################################################################
# Terraform Configuration (Staging) ###########################################
###############################################################################
###############################################################################

terraform {
  required_version = ">=1.1.0"

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

  # Uncomment for Terraform Cloud
  # cloud {
  #   organization = "your-organization"
  #   workspaces {
  #     name = "hardwire-infrastructure-staging"
  #   }
  # }
}

###############################################################################
###############################################################################
# Providers ###################################################################
###############################################################################
###############################################################################

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  }
}

provider "random" {
}

###############################################################################
###############################################################################
# VPC #########################################################################
###############################################################################
###############################################################################

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.environment}-${var.project_name}-vpc"
  }
}

###############################################################################
###############################################################################
# Subnets #####################################################################
###############################################################################
###############################################################################

resource "aws_subnet" "public_one" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_one_cidr
  availability_zone       = var.availability_zone_one
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-${var.project_name}-public-subnet-one"
    Type = "public"
  }
}

resource "aws_subnet" "public_two" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_two_cidr
  availability_zone       = var.availability_zone_two
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-${var.project_name}-public-subnet-two"
    Type = "public"
  }
}

resource "aws_subnet" "private_one" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_one_cidr
  availability_zone = var.availability_zone_one

  tags = {
    Name = "${var.environment}-${var.project_name}-private-subnet-one"
    Type = "private"
  }
}

resource "aws_subnet" "private_two" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_two_cidr
  availability_zone = var.availability_zone_two

  tags = {
    Name = "${var.environment}-${var.project_name}-private-subnet-two"
    Type = "private"
  }
}

resource "aws_db_subnet_group" "main" {
  name = "${var.environment}-${var.project_name}-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  tags = {
    Name = "${var.environment}-${var.project_name}-db-subnet-group"
  }
}

###############################################################################
###############################################################################
# Internet Gateway & NAT (Single NAT for staging to reduce costs) #############
###############################################################################
###############################################################################

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-${var.project_name}-internet-gateway"
  }
}

# Single EIP for staging (cost savings)
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.environment}-${var.project_name}-elastic-ip"
  }

  depends_on = [aws_internet_gateway.main]
}

# Single NAT Gateway for staging (cost savings)
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_one.id

  depends_on = [
    aws_subnet.public_one,
    aws_eip.nat,
    aws_internet_gateway.main
  ]

  tags = {
    Name = "${var.environment}-${var.project_name}-nat-gateway"
  }
}

###############################################################################
###############################################################################
# Route Tables ################################################################
###############################################################################
###############################################################################

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-route-table-public"
  }
}

resource "aws_route_table_association" "public_one" {
  subnet_id      = aws_subnet.public_one.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_two" {
  subnet_id      = aws_subnet.public_two.id
  route_table_id = aws_route_table.public.id
}

# Single private route table (both subnets use same NAT)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-route-table-private"
  }
}

resource "aws_route_table_association" "private_one" {
  subnet_id      = aws_subnet.private_one.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_two" {
  subnet_id      = aws_subnet.private_two.id
  route_table_id = aws_route_table.private.id
}
