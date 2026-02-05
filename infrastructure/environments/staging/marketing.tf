###############################################################################
###############################################################################
# Marketing Site S3 Bucket (Staging) ##########################################
###############################################################################
###############################################################################

resource "random_id" "marketing_bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "marketing" {
  bucket = "${var.environment}-${var.project_name}-marketing-${random_id.marketing_bucket_suffix.hex}"

  tags = {
    Name = "${var.environment}-${var.project_name}-marketing"
  }
}

resource "aws_s3_bucket_ownership_controls" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_versioning" "marketing" {
  bucket = aws_s3_bucket.marketing.id

  versioning_configuration {
    status = "Enabled"
  }
}

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

resource "aws_cloudfront_origin_access_control" "marketing" {
  name                              = "${var.environment}-${var.project_name}-marketing-oac"
  description                       = "OAC for marketing site S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

###############################################################################
###############################################################################
# S3 Bucket Policy ############################################################
###############################################################################
###############################################################################

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

resource "aws_cloudfront_distribution" "marketing" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "${var.environment} ${var.project_name} marketing site"
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.marketing.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.marketing.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.marketing.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.marketing.id}"

    cache_policy_id          = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    origin_request_policy_id = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

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

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.marketing_domain == "" ? true : false
    acm_certificate_arn            = var.marketing_domain != "" ? var.marketing_certificate_arn : null
    ssl_support_method             = var.marketing_domain != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  aliases = var.marketing_domain != "" ? [var.marketing_domain] : []

  tags = {
    Name = "${var.environment}-${var.project_name}-marketing-cdn"
  }
}
