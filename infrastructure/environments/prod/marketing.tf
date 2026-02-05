###############################################################################
###############################################################################
# Marketing Site S3 Bucket ####################################################
###############################################################################
###############################################################################

# generate a random suffix for bucket name uniqueness
resource "random_id" "marketing_bucket_suffix" {
  byte_length = 4
}

# define an S3 bucket for the marketing static site
resource "aws_s3_bucket" "marketing" {

  # set the bucket name with random suffix for uniqueness
  bucket = "${var.environment}-${var.project_name}-marketing-${random_id.marketing_bucket_suffix.hex}"

  # tag the bucket for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-marketing"
  }
}

# configure bucket ownership controls
resource "aws_s3_bucket_ownership_controls" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# block public access to the bucket (CloudFront will serve content)
resource "aws_s3_bucket_public_access_block" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# configure the bucket for static website hosting
resource "aws_s3_bucket_website_configuration" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# configure bucket versioning for rollback capability
resource "aws_s3_bucket_versioning" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  versioning_configuration {
    status = "Enabled"
  }
}

# configure server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "marketing" {
  bucket = aws_s3_bucket.marketing.id

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
resource "aws_cloudfront_origin_access_control" "marketing" {
  name                              = "${var.environment}-${var.project_name}-marketing-oac"
  description                       = "OAC for marketing site S3 bucket"
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
resource "aws_s3_bucket_policy" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.marketing.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.marketing.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.marketing]
}

###############################################################################
###############################################################################
# CloudFront Distribution #####################################################
###############################################################################
###############################################################################

# define a CloudFront distribution for the marketing site
resource "aws_cloudfront_distribution" "marketing" {

  # enable the distribution
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.environment} ${var.project_name} marketing site"
  price_class         = "PriceClass_100"  # US, Canada, Europe (cheapest)

  # configure the S3 origin
  origin {
    domain_name              = aws_s3_bucket.marketing.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.marketing.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.marketing.id
  }

  # default cache behavior
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.marketing.id}"

    # use managed cache policy for optimal caching
    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6"  # CachingOptimized
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"  # CORS-S3Origin

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    # TTL settings
    min_ttl     = 0
    default_ttl = 3600     # 1 hour
    max_ttl     = 86400    # 24 hours
  }

  # custom error responses for SPA routing
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
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
    cloudfront_default_certificate = var.marketing_domain == "" ? true : false

    # use ACM certificate if custom domain is provided
    acm_certificate_arn      = var.marketing_domain != "" ? var.marketing_certificate_arn : null
    ssl_support_method       = var.marketing_domain != "" ? "sni-only" : null
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # custom domain aliases (if provided)
  aliases = var.marketing_domain != "" ? [var.marketing_domain] : []

  # tag the distribution for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-marketing-cdn"
  }
}

###############################################################################
###############################################################################
# CloudFront Function for URL Rewriting ######################################
###############################################################################
###############################################################################

# CloudFront function for URL rewriting (add .html extension, trailing slash handling)
resource "aws_cloudfront_function" "marketing_url_rewrite" {
  name    = "${var.environment}-${var.project_name}-marketing-url-rewrite"
  runtime = "cloudfront-js-1.0"
  comment = "URL rewriting for marketing site"
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
            // Redirect to add trailing slash
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
