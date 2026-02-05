###############################################################################
###############################################################################
# CloudWatch Log Groups (Staging) #############################################
###############################################################################
###############################################################################

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-backend"
  retention_in_days = 14  # Shorter retention for staging

  tags = {
    Name    = "${var.environment}-${var.project_name}-backend-logs"
    Service = "backend"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-frontend"
  retention_in_days = 14

  tags = {
    Name    = "${var.environment}-${var.project_name}-frontend-logs"
    Service = "frontend"
  }
}

resource "aws_cloudwatch_log_group" "mcp_tools" {
  name              = "/aws/apprunner/${var.environment}-${var.project_name}-mcp-tools"
  retention_in_days = 14

  tags = {
    Name    = "${var.environment}-${var.project_name}-mcp-tools-logs"
    Service = "mcp-tools"
  }
}

###############################################################################
###############################################################################
# CloudWatch Alarms (Staging - minimal) #######################################
###############################################################################
###############################################################################

resource "aws_sns_topic" "alerts" {
  name = "${var.environment}-${var.project_name}-alerts"

  tags = {
    Name = "${var.environment}-${var.project_name}-alerts"
  }
}

# Basic RDS CPU alarm for staging
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.environment}-${var.project_name}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 90  # Higher threshold for staging
  alarm_description   = "RDS CPU utilization is above 90%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-rds-cpu-alarm"
  }
}
