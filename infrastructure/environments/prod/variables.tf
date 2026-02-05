###############################################################################
###############################################################################
# Variables ###################################################################
###############################################################################
###############################################################################

variable "environment" {
  description = "The environment name (prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "The project name used for resource naming"
  type        = string
  default     = "hardwire"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-2"
}

###############################################################################
# VPC Configuration ###########################################################
###############################################################################

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_one_cidr" {
  description = "CIDR block for public subnet one"
  type        = string
  default     = "10.0.0.0/24"
}

variable "public_subnet_two_cidr" {
  description = "CIDR block for public subnet two"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_one_cidr" {
  description = "CIDR block for private subnet one"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_two_cidr" {
  description = "CIDR block for private subnet two"
  type        = string
  default     = "10.0.3.0/24"
}

variable "availability_zone_one" {
  description = "First availability zone"
  type        = string
  default     = "us-east-2a"
}

variable "availability_zone_two" {
  description = "Second availability zone"
  type        = string
  default     = "us-east-2b"
}

###############################################################################
# Database Configuration ######################################################
###############################################################################

variable "db_instance_class" {
  description = "Instance class for the RDS PostgreSQL database"
  type        = string
  default     = "db.t3.small"
}

variable "db_allocated_storage" {
  description = "Allocated storage for the database in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for autoscaling in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "app"
}

variable "db_username" {
  description = "Master username for the database"
  type        = string
  default     = "hardwire_admin"
}

variable "db_password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}

###############################################################################
# Redis Configuration #########################################################
###############################################################################

variable "redis_node_type" {
  description = "Node type for the ElastiCache Redis cluster"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes in the Redis cluster"
  type        = number
  default     = 1
}

###############################################################################
# App Runner Configuration ####################################################
###############################################################################

variable "github_connection_arn" {
  description = "ARN of the existing GitHub connection for App Runner (create manually in AWS Console)"
  type        = string
}

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
  default     = "branmcf"
}

variable "github_repo_backend" {
  description = "GitHub repository name for the backend"
  type        = string
  default     = "hardwire-take-home"
}

variable "github_repo_frontend" {
  description = "GitHub repository name for the frontend"
  type        = string
  default     = "hardwire-take-home"
}

variable "github_repo_mcp_tools" {
  description = "GitHub repository name for the MCP tools server"
  type        = string
  default     = "hardwire-take-home"
}

variable "backend_branch" {
  description = "Branch to deploy for the backend service"
  type        = string
  default     = "main"
}

variable "frontend_branch" {
  description = "Branch to deploy for the frontend service"
  type        = string
  default     = "main"
}

variable "mcp_tools_branch" {
  description = "Branch to deploy for the MCP tools server"
  type        = string
  default     = "main"
}

variable "backend_cpu" {
  description = "CPU units for backend App Runner service (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "1024"
}

variable "backend_memory" {
  description = "Memory in MB for backend App Runner service (512, 1024, 2048, 3072, 4096, 6144, 8192, 10240, 12288)"
  type        = string
  default     = "2048"
}

variable "frontend_cpu" {
  description = "CPU units for frontend App Runner service"
  type        = string
  default     = "1024"
}

variable "frontend_memory" {
  description = "Memory in MB for frontend App Runner service"
  type        = string
  default     = "2048"
}

variable "mcp_tools_cpu" {
  description = "CPU units for MCP tools App Runner service"
  type        = string
  default     = "512"
}

variable "mcp_tools_memory" {
  description = "Memory in MB for MCP tools App Runner service"
  type        = string
  default     = "1024"
}

###############################################################################
# Marketing Site Configuration ################################################
###############################################################################

variable "marketing_domain" {
  description = "Custom domain for the marketing site (optional)"
  type        = string
  default     = ""
}

variable "marketing_certificate_arn" {
  description = "ARN of ACM certificate for marketing site HTTPS (required if using custom domain)"
  type        = string
  default     = ""
}

###############################################################################
# Documentation Site Configuration ############################################
###############################################################################

variable "docs_domain" {
  description = "Custom domain for the documentation site (optional, e.g., docs.example.com)"
  type        = string
  default     = ""
}

variable "docs_certificate_arn" {
  description = "ARN of ACM certificate for documentation site HTTPS (required if using custom domain)"
  type        = string
  default     = ""
}

###############################################################################
# Secrets Configuration #######################################################
###############################################################################

variable "better_auth_secret" {
  description = "Better Auth secret key"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key for LLM services"
  type        = string
  sensitive   = true
  default     = ""
}

variable "anthropic_api_key" {
  description = "Anthropic API key for LLM services"
  type        = string
  sensitive   = true
  default     = ""
}

variable "resend_api_key" {
  description = "Resend API key for email services"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe secret key for payment processing"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mcp_tools_api_key" {
  description = "API key for MCP tools server authentication"
  type        = string
  sensitive   = true
}
