###############################################################################
###############################################################################
# App Runner IAM Role #########################################################
###############################################################################
###############################################################################

# define IAM role for App Runner services
resource "aws_iam_role" "app_runner" {
  name = "${var.environment}-${var.project_name}-app-runner-role"

  # allow App Runner to assume this role
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

# define IAM policy for accessing Secrets Manager
resource "aws_iam_policy" "secrets_manager" {
  name        = "${var.environment}-${var.project_name}-secrets-manager-policy"
  description = "IAM policy that allows access to Secrets Manager secrets for this environment"

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

# attach secrets manager policy to App Runner role
resource "aws_iam_role_policy_attachment" "secrets_manager" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.secrets_manager.arn
}

###############################################################################
###############################################################################
# CloudWatch Logs Policy ######################################################
###############################################################################
###############################################################################

# define IAM policy for CloudWatch Logs
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.environment}-${var.project_name}-cloudwatch-logs-policy"
  description = "IAM policy that allows writing to CloudWatch Logs"

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

# attach CloudWatch logs policy to App Runner role
resource "aws_iam_role_policy_attachment" "cloudwatch_logs" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

###############################################################################
###############################################################################
# S3 Access Policy (for file storage if needed) ###############################
###############################################################################
###############################################################################

# define IAM policy for S3 access (optional, for application file storage)
resource "aws_iam_policy" "s3_access" {
  name        = "${var.environment}-${var.project_name}-s3-access-policy"
  description = "IAM policy that allows S3 access for application file storage"

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

# attach S3 access policy to App Runner role
resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.app_runner.name
  policy_arn = aws_iam_policy.s3_access.arn
}

###############################################################################
###############################################################################
# Marketing Site Deployment IAM User ##########################################
###############################################################################
###############################################################################

# create IAM user for marketing site deployment (CI/CD)
resource "aws_iam_user" "marketing_deploy" {
  name = "${var.environment}-${var.project_name}-marketing-deploy"

  tags = {
    Name = "${var.environment}-${var.project_name}-marketing-deploy"
  }
}

# define IAM policy for marketing site deployment
resource "aws_iam_policy" "marketing_deploy" {
  name        = "${var.environment}-${var.project_name}-marketing-deploy-policy"
  description = "IAM policy for deploying marketing site to S3 and invalidating CloudFront"

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

# attach marketing deploy policy to the user
resource "aws_iam_user_policy_attachment" "marketing_deploy" {
  user       = aws_iam_user.marketing_deploy.name
  policy_arn = aws_iam_policy.marketing_deploy.arn
}

# create access key for the deployment user
resource "aws_iam_access_key" "marketing_deploy" {
  user = aws_iam_user.marketing_deploy.name
}

###############################################################################
###############################################################################
# App Runner Access Role (for ECR/GitHub access) ##############################
###############################################################################
###############################################################################

# define IAM role for App Runner to access source code
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

# attach ECR read-only policy (in case you switch to ECR images later)
resource "aws_iam_role_policy_attachment" "app_runner_ecr" {
  role       = aws_iam_role.app_runner_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}
