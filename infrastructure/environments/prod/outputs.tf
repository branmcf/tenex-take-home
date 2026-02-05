###############################################################################
###############################################################################
# VPC Outputs #################################################################
###############################################################################
###############################################################################

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = [aws_subnet.public_one.id, aws_subnet.public_two.id]
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = [aws_subnet.private_one.id, aws_subnet.private_two.id]
}

###############################################################################
###############################################################################
# Database Outputs ############################################################
###############################################################################
###############################################################################

output "database_endpoint" {
  description = "The connection endpoint for the PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "database_port" {
  description = "The port the database is listening on"
  value       = aws_db_instance.postgres.port
}

output "database_name" {
  description = "The name of the database"
  value       = aws_db_instance.postgres.db_name
}

output "database_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.postgres.arn
}

###############################################################################
###############################################################################
# Redis Outputs ###############################################################
###############################################################################
###############################################################################

output "redis_endpoint" {
  description = "The endpoint for the Redis cluster"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "The port the Redis cluster is listening on"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].port
}

output "redis_arn" {
  description = "The ARN of the ElastiCache cluster"
  value       = aws_elasticache_cluster.redis.arn
}

###############################################################################
###############################################################################
# App Runner Outputs ##########################################################
###############################################################################
###############################################################################

output "backend_service_url" {
  description = "The URL of the backend App Runner service"
  value       = "https://${aws_apprunner_service.backend.service_url}"
}

output "backend_service_arn" {
  description = "The ARN of the backend App Runner service"
  value       = aws_apprunner_service.backend.arn
}

output "frontend_service_url" {
  description = "The URL of the frontend App Runner service"
  value       = "https://${aws_apprunner_service.frontend.service_url}"
}

output "frontend_service_arn" {
  description = "The ARN of the frontend App Runner service"
  value       = aws_apprunner_service.frontend.arn
}

output "mcp_tools_service_url" {
  description = "The URL of the MCP tools App Runner service"
  value       = "https://${aws_apprunner_service.mcp_tools.service_url}"
}

output "mcp_tools_service_arn" {
  description = "The ARN of the MCP tools App Runner service"
  value       = aws_apprunner_service.mcp_tools.arn
}

###############################################################################
###############################################################################
# Marketing Site Outputs ######################################################
###############################################################################
###############################################################################

output "marketing_bucket_name" {
  description = "The name of the S3 bucket for the marketing site"
  value       = aws_s3_bucket.marketing.id
}

output "marketing_bucket_arn" {
  description = "The ARN of the S3 bucket for the marketing site"
  value       = aws_s3_bucket.marketing.arn
}

output "marketing_cloudfront_domain" {
  description = "The CloudFront domain name for the marketing site"
  value       = aws_cloudfront_distribution.marketing.domain_name
}

output "marketing_cloudfront_url" {
  description = "The full URL for the marketing site"
  value       = "https://${aws_cloudfront_distribution.marketing.domain_name}"
}

output "marketing_cloudfront_distribution_id" {
  description = "The CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.marketing.id
}

###############################################################################
###############################################################################
# Documentation Site Outputs ##################################################
###############################################################################
###############################################################################

output "docs_bucket_name" {
  description = "The name of the S3 bucket for the documentation site"
  value       = aws_s3_bucket.docs.id
}

output "docs_bucket_arn" {
  description = "The ARN of the S3 bucket for the documentation site"
  value       = aws_s3_bucket.docs.arn
}

output "docs_cloudfront_domain" {
  description = "The CloudFront domain name for the documentation site"
  value       = aws_cloudfront_distribution.docs.domain_name
}

output "docs_cloudfront_url" {
  description = "The full URL for the documentation site"
  value       = "https://${aws_cloudfront_distribution.docs.domain_name}"
}

output "docs_cloudfront_distribution_id" {
  description = "The CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.docs.id
}

output "docs_deploy_access_key_id" {
  description = "Access key ID for documentation site deployment"
  value       = aws_iam_access_key.docs_deploy.id
  sensitive   = true
}

output "docs_deploy_secret_access_key" {
  description = "Secret access key for documentation site deployment"
  value       = aws_iam_access_key.docs_deploy.secret
  sensitive   = true
}

###############################################################################
###############################################################################
# IAM Outputs #################################################################
###############################################################################
###############################################################################

output "app_runner_role_arn" {
  description = "The ARN of the App Runner IAM role"
  value       = aws_iam_role.app_runner.arn
}

output "marketing_deploy_access_key_id" {
  description = "Access key ID for marketing site deployment"
  value       = aws_iam_access_key.marketing_deploy.id
  sensitive   = true
}

output "marketing_deploy_secret_access_key" {
  description = "Secret access key for marketing site deployment"
  value       = aws_iam_access_key.marketing_deploy.secret
  sensitive   = true
}

###############################################################################
###############################################################################
# Secrets Manager Outputs #####################################################
###############################################################################
###############################################################################

output "database_url_secret_arn" {
  description = "The ARN of the database URL secret"
  value       = aws_secretsmanager_secret.database_url.arn
}

output "redis_url_secret_arn" {
  description = "The ARN of the Redis URL secret"
  value       = aws_secretsmanager_secret.redis_url.arn
}

###############################################################################
###############################################################################
# Monitoring Outputs ##########################################################
###############################################################################
###############################################################################

output "alerts_topic_arn" {
  description = "The ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "dashboard_url" {
  description = "URL to the CloudWatch dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${var.environment}-${var.project_name}-dashboard"
}

###############################################################################
###############################################################################
# Convenience Outputs #########################################################
###############################################################################
###############################################################################

output "environment" {
  description = "The environment name"
  value       = var.environment
}

output "project_name" {
  description = "The project name"
  value       = var.project_name
}

output "aws_region" {
  description = "The AWS region"
  value       = var.aws_region
}
