###############################################################################
###############################################################################
# App Runner VPC Security Group (Staging) #####################################
###############################################################################
###############################################################################

resource "aws_security_group" "app_runner" {
  name        = "${var.environment}-${var.project_name}-apprunner-sg"
  description = "Security group for App Runner VPC connector"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-apprunner-sg"
  }
}

###############################################################################
###############################################################################
# App Runner VPC Connector ####################################################
###############################################################################
###############################################################################

resource "aws_apprunner_vpc_connector" "main" {
  vpc_connector_name = "${var.environment}-${var.project_name}-vpc-connector"

  subnets = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  security_groups = [aws_security_group.app_runner.id]

  tags = {
    Name = "${var.environment}-${var.project_name}-vpc-connector"
  }
}

###############################################################################
###############################################################################
# App Runner Auto Scaling (Staging - minimal) #################################
###############################################################################
###############################################################################

resource "aws_apprunner_auto_scaling_configuration_version" "backend" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-backend-autoscale"

  min_size        = 1
  max_size        = 3  # Lower for staging
  max_concurrency = 100

  tags = {
    Name = "${var.environment}-${var.project_name}-backend-autoscale"
  }
}

resource "aws_apprunner_auto_scaling_configuration_version" "frontend" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-frontend-autoscale"

  min_size        = 1
  max_size        = 3
  max_concurrency = 100

  tags = {
    Name = "${var.environment}-${var.project_name}-frontend-autoscale"
  }
}

resource "aws_apprunner_auto_scaling_configuration_version" "mcp_tools" {
  auto_scaling_configuration_name = "${var.environment}-${var.project_name}-mcp-tools-autoscale"

  min_size        = 1
  max_size        = 2
  max_concurrency = 50

  tags = {
    Name = "${var.environment}-${var.project_name}-mcp-tools-autoscale"
  }
}

###############################################################################
###############################################################################
# App Runner MCP Tools Server #################################################
###############################################################################
###############################################################################

resource "aws_apprunner_service" "mcp_tools" {
  service_name = "${var.environment}-${var.project_name}-mcp-tools"

  source_configuration {
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    code_repository {
      code_configuration {
        code_configuration_values {
          port          = "4010"
          runtime       = "NODEJS_18"
          build_command = "cd mcp-tools-server && npm ci && npm run build"
          start_command = "cd mcp-tools-server && npm run start"

          runtime_environment_variables = {
            "PORT"     = "4010"
            "NODE_ENV" = "staging"
          }

          runtime_environment_secrets = {
            "MCP_TOOLS_API_KEY" = aws_secretsmanager_secret.mcp_tools_api_key.arn
          }
        }

        configuration_source = "API"
      }

      repository_url = "https://github.com/${var.github_org}/${var.github_repo_mcp_tools}"

      source_code_version {
        type  = "BRANCH"
        value = var.mcp_tools_branch
      }
    }

    auto_deployments_enabled = true
  }

  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.mcp_tools_cpu
    memory            = var.mcp_tools_memory
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.mcp_tools.arn

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  observability_configuration {
    observability_enabled = true
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-mcp-tools"
  }

  depends_on = [
    aws_secretsmanager_secret_version.mcp_tools_api_key
  ]
}

###############################################################################
###############################################################################
# App Runner Backend Service ##################################################
###############################################################################
###############################################################################

resource "aws_apprunner_service" "backend" {
  service_name = "${var.environment}-${var.project_name}-backend"

  source_configuration {
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    code_repository {
      code_configuration {
        code_configuration_values {
          port          = "3026"
          runtime       = "NODEJS_18"
          build_command = "cd backend && npm ci && npm run build"
          start_command = "cd backend && npm run start"

          runtime_environment_variables = {
            "PORT"          = "3026"
            "NODE_ENV"      = "staging"
            "MCP_TOOLS_URL" = "https://${aws_apprunner_service.mcp_tools.service_url}"
          }

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

        configuration_source = "API"
      }

      repository_url = "https://github.com/${var.github_org}/${var.github_repo_backend}"

      source_code_version {
        type  = "BRANCH"
        value = var.backend_branch
      }
    }

    auto_deployments_enabled = true
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.main.arn
    }

    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.backend_cpu
    memory            = var.backend_memory
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.backend.arn

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  observability_configuration {
    observability_enabled = true
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-backend"
  }

  depends_on = [
    aws_secretsmanager_secret_version.database_url,
    aws_secretsmanager_secret_version.redis_url,
    aws_secretsmanager_secret_version.better_auth_secret,
    aws_apprunner_service.mcp_tools
  ]
}

###############################################################################
###############################################################################
# App Runner Frontend Service #################################################
###############################################################################
###############################################################################

resource "aws_apprunner_service" "frontend" {
  service_name = "${var.environment}-${var.project_name}-frontend"

  source_configuration {
    authentication_configuration {
      connection_arn = var.github_connection_arn
    }

    code_repository {
      code_configuration {
        code_configuration_values {
          port          = "3000"
          runtime       = "NODEJS_18"
          build_command = "cd frontend && npm ci && npm run build"
          start_command = "cd frontend && npm run start"

          runtime_environment_variables = {
            "PORT"                = "3000"
            "NODE_ENV"            = "staging"
            "NEXT_PUBLIC_API_URL" = "https://${aws_apprunner_service.backend.service_url}"
          }
        }

        configuration_source = "API"
      }

      repository_url = "https://github.com/${var.github_org}/${var.github_repo_frontend}"

      source_code_version {
        type  = "BRANCH"
        value = var.frontend_branch
      }
    }

    auto_deployments_enabled = true
  }

  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.app_runner.arn
    cpu               = var.frontend_cpu
    memory            = var.frontend_memory
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.frontend.arn

  health_check_configuration {
    protocol            = "TCP"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  observability_configuration {
    observability_enabled = true
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-frontend"
  }

  depends_on = [
    aws_apprunner_service.backend
  ]
}
