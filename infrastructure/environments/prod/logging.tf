###############################################################################
###############################################################################
# CloudWatch Log Groups #######################################################
###############################################################################
###############################################################################

# create CloudWatch log group for backend service
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-backend"
  retention_in_days = 30

  tags = {
    Name    = "${var.environment}-${var.project_name}-backend-logs"
    Service = "backend"
  }
}

# create CloudWatch log group for frontend service
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-frontend"
  retention_in_days = 30

  tags = {
    Name    = "${var.environment}-${var.project_name}-frontend-logs"
    Service = "frontend"
  }
}

# create CloudWatch log group for MCP tools service
resource "aws_cloudwatch_log_group" "mcp_tools" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-mcp-tools"
  retention_in_days = 30

  tags = {
    Name    = "${var.environment}-${var.project_name}-mcp-tools-logs"
    Service = "mcp-tools"
  }
}

# create CloudWatch log group for RDS PostgreSQL
resource "aws_cloudwatch_log_group" "rds_postgres" {
  name              = "/aws/rds/instance/${var.environment}-${var.project_name}-postgres/postgresql"
  retention_in_days = 30

  tags = {
    Name    = "${var.environment}-${var.project_name}-rds-logs"
    Service = "database"
  }
}

###############################################################################
###############################################################################
# CloudWatch Alarms ###########################################################
###############################################################################
###############################################################################

# create SNS topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.environment}-${var.project_name}-alerts"

  tags = {
    Name = "${var.environment}-${var.project_name}-alerts"
  }
}

# alarm for RDS CPU utilization
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.environment}-${var.project_name}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU utilization is above 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-rds-cpu-alarm"
  }
}

# alarm for RDS free storage space
resource "aws_cloudwatch_metric_alarm" "rds_storage" {
  alarm_name          = "${var.environment}-${var.project_name}-rds-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 3
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 5368709120  # 5 GB in bytes
  alarm_description   = "RDS free storage space is below 5 GB"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-rds-storage-alarm"
  }
}

# alarm for RDS database connections
resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  alarm_name          = "${var.environment}-${var.project_name}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "RDS database connections are above 100"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-rds-connections-alarm"
  }
}

# alarm for Redis CPU utilization
resource "aws_cloudwatch_metric_alarm" "redis_cpu" {
  alarm_name          = "${var.environment}-${var.project_name}-redis-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis CPU utilization is above 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = aws_elasticache_cluster.redis.cluster_id
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-redis-cpu-alarm"
  }
}

# alarm for Redis memory usage
resource "aws_cloudwatch_metric_alarm" "redis_memory" {
  alarm_name          = "${var.environment}-${var.project_name}-redis-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis memory usage is above 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    CacheClusterId = aws_elasticache_cluster.redis.cluster_id
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-redis-memory-alarm"
  }
}

###############################################################################
###############################################################################
# CloudWatch Dashboard ########################################################
###############################################################################
###############################################################################

# create a CloudWatch dashboard for monitoring
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.environment}-${var.project_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "text"
        x      = 0
        y      = 0
        width  = 24
        height = 1
        properties = {
          markdown = "# ${var.project_name} ${var.environment} Environment Dashboard"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 1
        width  = 12
        height = 6
        properties = {
          title  = "RDS CPU Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.postgres.identifier]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 1
        width  = 12
        height = 6
        properties = {
          title  = "RDS Database Connections"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", aws_db_instance.postgres.identifier]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 7
        width  = 12
        height = 6
        properties = {
          title  = "Redis CPU Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/ElastiCache", "CPUUtilization", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 7
        width  = 12
        height = 6
        properties = {
          title  = "Redis Memory Usage"
          region = var.aws_region
          metrics = [
            ["AWS/ElastiCache", "DatabaseMemoryUsagePercentage", "CacheClusterId", aws_elasticache_cluster.redis.cluster_id]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 13
        width  = 8
        height = 6
        properties = {
          title  = "CloudFront Requests"
          region = "us-east-1"  # CloudFront metrics are always in us-east-1
          metrics = [
            ["AWS/CloudFront", "Requests", "DistributionId", aws_cloudfront_distribution.marketing.id, "Region", "Global"]
          ]
          period = 300
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 13
        width  = 8
        height = 6
        properties = {
          title  = "CloudFront Error Rate"
          region = "us-east-1"
          metrics = [
            ["AWS/CloudFront", "4xxErrorRate", "DistributionId", aws_cloudfront_distribution.marketing.id, "Region", "Global"],
            ["AWS/CloudFront", "5xxErrorRate", "DistributionId", aws_cloudfront_distribution.marketing.id, "Region", "Global"]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 13
        width  = 8
        height = 6
        properties = {
          title  = "CloudFront Bytes Downloaded"
          region = "us-east-1"
          metrics = [
            ["AWS/CloudFront", "BytesDownloaded", "DistributionId", aws_cloudfront_distribution.marketing.id, "Region", "Global"]
          ]
          period = 300
          stat   = "Sum"
        }
      }
    ]
  })
}
