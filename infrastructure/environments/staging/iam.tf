###############################################################################
###############################################################################
# App Runner IAM Role (Staging) ###############################################
###############################################################################
###############################################################################

resource "aws_iam_role" "app_runner" {
  name = "${var.environment}-${var.project_name}-app-runner-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.environment}-${var.project_name}-app-runner-role"
  }
}

###############################################################################
###############################################################################
# Secrets Manager Policy ######################################################
###############################################################################
###############################################################################

resource "aws_iam_policy" "secrets_manager" {
  name        = "${var.environment}-${var.project_name}-secrets-manager-policy"
  description = "IAM policy for Secrets Manager access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:*:secret:${var.environment}/${var.project_name}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "secrets_manager" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.secrets_manager.arn
}

###############################################################################
###############################################################################
# CloudWatch Logs Policy ######################################################
###############################################################################
###############################################################################

resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.environment}-${var.project_name}-cloudwatch-logs-policy"
  description = "IAM policy for CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = [
          "arn:aws:logs:${var.aws_region}:*:log-group:/aws/apprunner/${var.environment}-${var.project_name}-*",
          "arn:aws:logs:${var.aws_region}:*:log-group:/aws/apprunner/${var.environment}-${var.project_name}-*:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

###############################################################################
###############################################################################
# S3 Access Policy ############################################################
###############################################################################
###############################################################################

resource "aws_iam_policy" "s3_access" {
  name        = "${var.environment}-${var.project_name}-s3-access-policy"
  description = "IAM policy for S3 access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.environment}-${var.project_name}-*",
          "arn:aws:s3:::${var.environment}-${var.project_name}-*/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.s3_access.arn
}

###############################################################################
###############################################################################
# Marketing Site Deployment IAM User ##########################################
###############################################################################
###############################################################################

resource "aws_iam_user" "marketing_deploy" {
  name = "${var.environment}-${var.project_name}-marketing-deploy"

  tags = {
    Name = "${var.environment}-${var.project_name}-marketing-deploy"
  }
}

resource "aws_iam_policy" "marketing_deploy" {
  name        = "${var.environment}-${var.project_name}-marketing-deploy-policy"
  description = "IAM policy for marketing site deployment"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.marketing.arn,
          "${aws_s3_bucket.marketing.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = aws_cloudfront_distribution.marketing.arn
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "marketing_deploy" {
  user       = aws_iam_user.marketing_deploy.name
  policy_arn = aws_iam_policy.marketing_deploy.arn
}

resource "aws_iam_access_key" "marketing_deploy" {
  user = aws_iam_user.marketing_deploy.name
}

###############################################################################
###############################################################################
# App Runner Access Role ######################################################
###############################################################################
###############################################################################

resource "aws_iam_role" "app_runner_access" {
  name = "${var.environment}-${var.project_name}-app-runner-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.environment}-${var.project_name}-app-runner-access-role"
  }
}

resource "aws_iam_role_policy_attachment" "app_runner_ecr" {
  role       = aws_iam_role.app_runner_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}
