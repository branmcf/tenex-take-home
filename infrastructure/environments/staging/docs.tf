###############################################################################
###############################################################################
# Documentation Site S3 Bucket (Staging) ######################################
###############################################################################
###############################################################################

# generate a random suffix for bucket name uniqueness
resource "random_id" "docs_bucket_suffix" {
  byte_length = 4
}

# define an S3 bucket for the documentation static site
resource "aws_s3_bucket" "docs" {

  # set the bucket name with random suffix for uniqueness
  bucket = "${var.environment}-${var.project_name}-docs-${random_id.docs_bucket_suffix.hex}"

  # tag the bucket for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-docs"
  }
}

# configure bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "docs" {
  bucket = aws_s3_bucket.docs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# block public access to the bucket (CloudFront will serve content)
resource "aws_s3_bucket_public_access_block" "docs" {
  bucket = aws_s3_bucket.docs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# configure the bucket for static website hosting
resource "aws_s3_bucket_website_configuration" "docs" {
  bucket = aws_s3_bucket.docs.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# configure bucket versioning for rollback capability
resource "aws_s3_bucket_versioning" "docs" {
  bucket = aws_s3_bucket.docs.id

  versioning_configuration {
    status = "Enabled"
  }
}

# configure server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "docs" {
  bucket = aws_s3_bucket.docs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

###############################################################################
###############################################################################
# CloudFront Origin Access Control ############################################
###############################################################################
###############################################################################

# create Origin Access Control for CloudFront to access S3
resource "aws_cloudfront_origin_access_control" "docs" {
  name                              = "${var.environment}-${var.project_name}-docs-oac"
  description                       = "OAC for documentation site S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

###############################################################################
###############################################################################
# S3 Bucket Policy for CloudFront #############################################
###############################################################################
###############################################################################

# define the bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "docs" {
  bucket = aws_s3_bucket.docs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.docs.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.docs.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.docs]
}

###############################################################################
###############################################################################
# CloudFront Distribution #####################################################
###############################################################################
###############################################################################

# define a CloudFront distribution for the documentation site
resource "aws_cloudfront_distribution" "docs" {

  # enable the distribution
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.environment} ${var.project_name} documentation site"
  price_class         = "PriceClass_100" # US, Canada, Europe (cheapest)

  # configure the S3 origin
  origin {
    domain_name              = aws_s3_bucket.docs.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.docs.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.docs.id
  }

  # default cache behavior
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.docs.id}"

    # use managed cache policy for optimal caching
    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # CORS-S3Origin

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    # associate the URL rewrite function
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.docs_url_rewrite.arn
    }

    # TTL settings
    min_ttl     = 0
    default_ttl = 3600  # 1 hour
    max_ttl     = 86400 # 24 hours
  }

  # custom error responses for documentation 404 pages
  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/404.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  # restrictions (no geographic restrictions)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL/TLS configuration
  viewer_certificate {
    # use CloudFront default certificate if no custom domain
    cloudfront_default_certificate = var.docs_domain == "" ? true : false

    # use ACM certificate if custom domain is provided
    acm_certificate_arn      = var.docs_domain != "" ? var.docs_certificate_arn : null
    ssl_support_method       = var.docs_domain != "" ? "sni-only" : null
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # custom domain aliases (if provided)
  aliases = var.docs_domain != "" ? [var.docs_domain] : []

  # tag the distribution for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-docs-cdn"
  }
}

###############################################################################
###############################################################################
# CloudFront Function for URL Rewriting ######################################
###############################################################################
###############################################################################

# CloudFront function for URL rewriting (MkDocs style routing)
resource "aws_cloudfront_function" "docs_url_rewrite" {
  name    = "${var.environment}-${var.project_name}-docs-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "URL rewriting for MkDocs documentation site"
  publish = true

  code = <<-EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check if URI is missing a file extension
    if (!uri.includes('.')) {
        // Check if URI ends with /
        if (uri.endsWith('/')) {
            request.uri += 'index.html';
        } else {
            // Redirect to add trailing slash for clean URLs
            return {
                statusCode: 301,
                statusDescription: 'Moved Permanently',
                headers: {
                    'location': { value: uri + '/' }
                }
            };
        }
    }

    return request;
}
EOF
}

###############################################################################
###############################################################################
# Documentation Site Deployment IAM User ######################################
###############################################################################
###############################################################################

# create IAM user for documentation site deployment (CI/CD)
resource "aws_iam_user" "docs_deploy" {
  name = "${var.environment}-${var.project_name}-docs-deploy"

  tags = {
    Name = "${var.environment}-${var.project_name}-docs-deploy"
  }
}

# define IAM policy for documentation site deployment
resource "aws_iam_policy" "docs_deploy" {
  name        = "${var.environment}-${var.project_name}-docs-deploy-policy"
  description = "IAM policy for deploying documentation site to S3 and invalidating CloudFront"

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
          aws_s3_bucket.docs.arn,
          "${aws_s3_bucket.docs.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = aws_cloudfront_distribution.docs.arn
      }
    ]
  })
}

# attach docs deploy policy to the user
resource "aws_iam_user_policy_attachment" "docs_deploy" {
  user       = aws_iam_user.docs_deploy.name
  policy_arn = aws_iam_policy.docs_deploy.arn
}

# create access key for the deployment user
resource "aws_iam_access_key" "docs_deploy" {
  user = aws_iam_user.docs_deploy.name
}
