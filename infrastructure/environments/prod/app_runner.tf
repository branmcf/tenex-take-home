###############################################################################
###############################################################################
# App Runner VPC Security Group ###############################################
###############################################################################
###############################################################################

# define a security group for App Runner VPC connector
resource "aws_security_group" "app_runner" {

  # set the name and description of the security group
  name        = "${var.environment}-${var.project_name}-apprunner-sg"
  description = "Security group for App Runner VPC connector"

  # associate with the VPC
  vpc_id = aws_vpc.main.id

  # allow all outbound traffic (App Runner needs to connect to databases, APIs, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # tag the security group for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-apprunner-sg"
  }
}

###############################################################################
###############################################################################
# App Runner VPC Connector ####################################################
###############################################################################
###############################################################################

# define a resource for an AWS App Runner VPC connector
resource "aws_apprunner_vpc_connector" "main" {

  # set the name of the VPC connector
  vpc_connector_name = "${var.environment}-${var.project_name}-vpc-connector"

  # set the IDs of the subnets to be used by the VPC connector (private subnets for database access)
  subnets = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  # set the security group IDs to associate with the VPC connector
  security_groups = [aws_security_group.app_runner.id]

  # tag the VPC connector for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-vpc-connector"
  }
}

###############################################################################
###############################################################################
# App Runner Auto Scaling Configuration #######################################
###############################################################################
###############################################################################

# define auto scaling configuration for backend service
resource "aws_apprunner_auto_scaling_configuration_version" "backend" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-backend-autoscale"

  # minimum number of instances
  min_size = 1

  # maximum number of instances
  max_size = 10

  # target concurrency (requests per instance)
  max_concurrency = 100

  tags = {
    Name = "${var.environment}-${var.project_name}-backend-autoscale"
  }
}

# define auto scaling configuration for frontend service
resource "aws_apprunner_auto_scaling_configuration_version" "frontend" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-frontend-autoscale"

  min_size        = 1
  max_size        = 10
  max_concurrency = 100

  tags = {
    Name = "${var.environment}-${var.project_name}-frontend-autoscale"
  }
}

# define auto scaling configuration for MCP tools service
resource "aws_apprunner_auto_scaling_configuration_version" "mcp_tools" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-mcp-tools-autoscale"

  min_size        = 1
  max_size        = 5
  max_concurrency = 50

  tags = {
    Name = "${var.environment}-${var.project_name}-mcp-tools-autoscale"
  }
}

###############################################################################
###############################################################################
# App Runner Backend Service ##################################################
###############################################################################
###############################################################################

# define a resource for the Backend API App Runner service
resource "aws_apprunner_service" "backend" {

  # set the name of the App Runner service
  service_name = "${var.environment}-${var.project_name}-backend"

  # define the source configuration for the service
  source_configuration {

    # authentication configuration for GitHub access
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    # define the code repository settings
    code_repository {

      # code configuration for the Node.js application
      code_configuration {

        # set the code configuration values
        code_configuration_values {

          # set the application's listening port
          port = "3026"

          # set the runtime environment to Node.js 20
          runtime = "NODEJS_18"

          # set the command to build the application
          build_command = "cd backend && npm ci && npm run build"

          # set the command to start the application
          start_command = "cd backend && npm run start"

          # set runtime environment variables
          runtime_environment_variables = {
            "PORT"          = "3026"
            "NODE_ENV"      = "production"
            "MCP_TOOLS_URL" = "https://${aws_apprunner_service.mcp_tools.service_url}"
          }

          # set runtime environment secrets from AWS Secrets Manager
          runtime_environment_secrets = {
            "DATABASE_URL"       = aws_secretsmanager_secret.database_url.arn
            "REDIS_URL"          = aws_secretsmanager_secret.redis_url.arn
            "BETTER_AUTH_SECRET" = aws_secretsmanager_secret.better_auth_secret.arn
            "OPENAI_API_KEY"     = aws_secretsmanager_secret.openai_api_key.arn
            "ANTHROPIC_API_KEY"  = aws_secretsmanager_secret.anthropic_api_key.arn
            "RESEND_API_KEY"     = aws_secretsmanager_secret.resend_api_key.arn
            "STRIPE_SECRET_KEY"  = aws_secretsmanager_secret.stripe_secret_key.arn
            "MCP_TOOLS_API_KEY"  = aws_secretsmanager_secret.mcp_tools_api_key.arn
          }
        }

        # specify that configuration is provided via API (not apprunner.yaml)
        configuration_source = "API"
      }

      # set the URL of the GitHub repository
      repository_url = "https://github.com/${var.github_org}/${var.github_repo_backend}"

      # define the source code version
      source_code_version {
        type  = "BRANCH"
        value = var.backend_branch
      }
    }

    # auto-deploy on push
    auto_deployments_enabled = true
  }

  # define the network configuration for VPC access
  network_configuration {

    # egress configuration for accessing VPC resources
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.main.arn
    }

    # ingress configuration (public access)
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  # instance configuration
  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.backend_cpu
    memory            = var.backend_memory
  }

  # auto scaling configuration
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.backend.arn

  # health check configuration
  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  # observability configuration for CloudWatch
  observability_configuration {
    observability_enabled = true
  }

  # tag the service for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-backend"
  }

  # ensure secrets and MCP tools service are created first
  depends_on = [
    aws_secretsmanager_secret_version.database_url,
    aws_secretsmanager_secret_version.redis_url,
    aws_secretsmanager_secret_version.better_auth_secret,
    aws_apprunner_service.mcp_tools
  ]
}

###############################################################################
###############################################################################
# App Runner MCP Tools Server #################################################
###############################################################################
###############################################################################

# define a resource for the MCP Tools Server App Runner service
resource "aws_apprunner_service" "mcp_tools" {

  # set the name of the App Runner service
  service_name = "${var.environment}-${var.project_name}-mcp-tools"

  # define the source configuration for the service
  source_configuration {

    # authentication configuration for GitHub access
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    # define the code repository settings
    code_repository {

      # code configuration for the Node.js application
      code_configuration {

        # set the code configuration values
        code_configuration_values {

          # set the application's listening port
          port = "4010"

          # set the runtime environment to Node.js 18
          runtime = "NODEJS_18"

          # set the command to build the application
          build_command = "cd mcp-tools-server && npm ci && npm run build"

          # set the command to start the application
          start_command = "cd mcp-tools-server && npm run start"

          # set runtime environment variables
          runtime_environment_variables = {
            "PORT"     = "4010"
            "NODE_ENV" = "production"
          }

          # set runtime environment secrets
          runtime_environment_secrets = {
            "MCP_TOOLS_API_KEY" = aws_secretsmanager_secret.mcp_tools_api_key.arn
          }
        }

        # specify that configuration is provided via API
        configuration_source = "API"
      }

      # set the URL of the GitHub repository
      repository_url = "https://github.com/${var.github_org}/${var.github_repo_mcp_tools}"

      # define the source code version
      source_code_version {
        type  = "BRANCH"
        value = var.mcp_tools_branch
      }
    }

    # auto-deploy on push
    auto_deployments_enabled = true
  }

  # define the network configuration (no VPC needed for MCP tools)
  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  # instance configuration
  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.mcp_tools_cpu
    memory            = var.mcp_tools_memory
  }

  # auto scaling configuration
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.mcp_tools.arn

  # health check configuration
  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  # observability configuration for CloudWatch
  observability_configuration {
    observability_enabled = true
  }

  # tag the service for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-mcp-tools"
  }

  # ensure secrets are created first
  depends_on = [
    aws_secretsmanager_secret_version.mcp_tools_api_key
  ]
}

###############################################################################
###############################################################################
# App Runner Frontend Service #################################################
###############################################################################
###############################################################################

# define a resource for the Frontend App Runner service
resource "aws_apprunner_service" "frontend" {

  # set the name of the App Runner service
  service_name = "${var.environment}-${var.project_name}-frontend"

  # define the source configuration for the service
  source_configuration {

    # authentication configuration for GitHub access
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    # define the code repository settings
    code_repository {

      # code configuration for the Next.js application
      code_configuration {

        # set the code configuration values
        code_configuration_values {

          # set the application's listening port
          port = "3000"

          # set the runtime environment to Node.js 20
          runtime = "NODEJS_18"

          # set the command to build the application
          build_command = "cd frontend && npm ci && npm run build"

          # set the command to start the application
          start_command = "cd frontend && npm run start"

          # set runtime environment variables
          runtime_environment_variables = {
            "PORT"                = "3000"
            "NODE_ENV"            = "production"
            "NEXT_PUBLIC_API_URL" = "https://${aws_apprunner_service.backend.service_url}"
          }
        }

        # specify that configuration is provided via API
        configuration_source = "API"
      }

      # set the URL of the GitHub repository
      repository_url = "https://github.com/${var.github_org}/${var.github_repo_frontend}"

      # define the source code version
      source_code_version {
        type  = "BRANCH"
        value = var.frontend_branch
      }
    }

    # auto-deploy on push
    auto_deployments_enabled = true
  }

  # define the network configuration (public access only)
  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  # instance configuration
  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.frontend_cpu
    memory            = var.frontend_memory
  }

  # auto scaling configuration
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.frontend.arn

  # health check configuration
  health_check_configuration {
    protocol            = "TCP"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  # observability configuration for CloudWatch
  observability_configuration {
    observability_enabled = true
  }

  # tag the service for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-frontend"
  }

  # ensure backend is created first (for API URL)
  depends_on = [
    aws_apprunner_service.backend
  ]
}
