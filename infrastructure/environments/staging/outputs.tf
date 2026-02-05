###############################################################################
###############################################################################
# Outputs (Staging) ###########################################################
###############################################################################
###############################################################################

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "database_endpoint" {
  description = "The connection endpoint for the PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  description = "The endpoint for the Redis cluster"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "backend_service_url" {
  description = "The URL of the backend App Runner service"
  value       = "https://${aws_apprunner_service.backend.service_url}"
}

output "frontend_service_url" {
  description = "The URL of the frontend App Runner service"
  value       = "https://${aws_apprunner_service.frontend.service_url}"
}

output "mcp_tools_service_url" {
  description = "The URL of the MCP tools App Runner service"
  value       = "https://${aws_apprunner_service.mcp_tools.service_url}"
}

output "marketing_bucket_name" {
  description = "The name of the S3 bucket for the marketing site"
  value       = aws_s3_bucket.marketing.id
}

output "marketing_cloudfront_url" {
  description = "The full URL for the marketing site"
  value       = "https://${aws_cloudfront_distribution.marketing.domain_name}"
}

output "marketing_cloudfront_distribution_id" {
  description = "The CloudFront distribution ID"
  value       = aws_cloudfront_distribution.marketing.id
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
# Documentation Site Outputs ##################################################
###############################################################################
###############################################################################

output "docs_bucket_name" {
  description = "The name of the S3 bucket for the documentation site"
  value       = aws_s3_bucket.docs.id
}

output "docs_cloudfront_url" {
  description = "The full URL for the documentation site"
  value       = "https://${aws_cloudfront_distribution.docs.domain_name}"
}

output "docs_cloudfront_distribution_id" {
  description = "The CloudFront distribution ID for the documentation site"
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

output "alerts_topic_arn" {
  description = "The ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "environment" {
  description = "The environment name"
  value       = var.environment
}

output "project_name" {
  description = "The project name"
  value       = var.project_name
}
