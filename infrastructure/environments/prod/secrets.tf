###############################################################################
###############################################################################
# AWS Secrets Manager - Database URL ##########################################
###############################################################################
###############################################################################

# create secret for database connection URL
resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.environment}/${var.project_name}/database-url"
  description = "PostgreSQL database connection URL for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-database-url"
  }
}

# set the secret value (database URL will be constructed from RDS endpoint)
resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"

  depends_on = [aws_db_instance.postgres]
}

###############################################################################
###############################################################################
# AWS Secrets Manager - Redis URL #############################################
###############################################################################
###############################################################################

# create secret for Redis connection URL
resource "aws_secretsmanager_secret" "redis_url" {
  name        = "${var.environment}/${var.project_name}/redis-url"
  description = "Redis connection URL for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-redis-url"
  }
}

# set the secret value (Redis URL will be constructed from ElastiCache endpoint)
resource "aws_secretsmanager_secret_version" "redis_url" {
  secret_id     = aws_secretsmanager_secret.redis_url.id
  secret_string = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:${aws_elasticache_cluster.redis.cache_nodes[0].port}"

  depends_on = [aws_elasticache_cluster.redis]
}

###############################################################################
###############################################################################
# AWS Secrets Manager - Better Auth Secret ####################################
###############################################################################
###############################################################################

# create secret for Better Auth
resource "aws_secretsmanager_secret" "better_auth_secret" {
  name        = "${var.environment}/${var.project_name}/better-auth-secret"
  description = "Better Auth secret key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-better-auth-secret"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "better_auth_secret" {
  secret_id     = aws_secretsmanager_secret.better_auth_secret.id
  secret_string = var.better_auth_secret
}

###############################################################################
###############################################################################
# AWS Secrets Manager - OpenAI API Key ########################################
###############################################################################
###############################################################################

# create secret for OpenAI API key
resource "aws_secretsmanager_secret" "openai_api_key" {
  name        = "${var.environment}/${var.project_name}/openai-api-key"
  description = "OpenAI API key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-openai-api-key"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "openai_api_key" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key != "" ? var.openai_api_key : "placeholder"
}

###############################################################################
###############################################################################
# AWS Secrets Manager - Anthropic API Key #####################################
###############################################################################
###############################################################################

# create secret for Anthropic API key
resource "aws_secretsmanager_secret" "anthropic_api_key" {
  name        = "${var.environment}/${var.project_name}/anthropic-api-key"
  description = "Anthropic API key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-anthropic-api-key"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "anthropic_api_key" {
  secret_id     = aws_secretsmanager_secret.anthropic_api_key.id
  secret_string = var.anthropic_api_key != "" ? var.anthropic_api_key : "placeholder"
}

###############################################################################
###############################################################################
# AWS Secrets Manager - Resend API Key ########################################
###############################################################################
###############################################################################

# create secret for Resend API key
resource "aws_secretsmanager_secret" "resend_api_key" {
  name        = "${var.environment}/${var.project_name}/resend-api-key"
  description = "Resend API key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-resend-api-key"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "resend_api_key" {
  secret_id     = aws_secretsmanager_secret.resend_api_key.id
  secret_string = var.resend_api_key != "" ? var.resend_api_key : "placeholder"
}

###############################################################################
###############################################################################
# AWS Secrets Manager - Stripe Secret Key #####################################
###############################################################################
###############################################################################

# create secret for Stripe secret key
resource "aws_secretsmanager_secret" "stripe_secret_key" {
  name        = "${var.environment}/${var.project_name}/stripe-secret-key"
  description = "Stripe secret key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-stripe-secret-key"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "stripe_secret_key" {
  secret_id     = aws_secretsmanager_secret.stripe_secret_key.id
  secret_string = var.stripe_secret_key != "" ? var.stripe_secret_key : "placeholder"
}

###############################################################################
###############################################################################
# AWS Secrets Manager - MCP Tools API Key #####################################
###############################################################################
###############################################################################

# create secret for MCP Tools API key
resource "aws_secretsmanager_secret" "mcp_tools_api_key" {
  name        = "${var.environment}/${var.project_name}/mcp-tools-api-key"
  description = "MCP Tools API key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.environment}-${var.project_name}-mcp-tools-api-key"
  }
}

# set the secret value
resource "aws_secretsmanager_secret_version" "mcp_tools_api_key" {
  secret_id     = aws_secretsmanager_secret.mcp_tools_api_key.id
  secret_string = var.mcp_tools_api_key
}
