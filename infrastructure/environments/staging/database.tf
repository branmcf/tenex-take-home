###############################################################################
###############################################################################
# Database Security Group (Staging) ###########################################
###############################################################################
###############################################################################

resource "aws_security_group" "postgres" {
  name        = "${var.environment}-${var.project_name}-postgres-sg"
  description = "Security group for PostgreSQL RDS database"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "PostgreSQL from VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-postgres-sg"
  }
}

###############################################################################
###############################################################################
# RDS PostgreSQL Database (Staging - Single AZ) ###############################
###############################################################################
###############################################################################

resource "aws_db_instance" "postgres" {
  identifier = "${var.environment}-${var.project_name}-postgres"

  engine         = "postgres"
  engine_version = "16.4"

  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.postgres.id]

  publicly_accessible = false

  # Staging: shorter backup retention, single AZ
  backup_retention_period = 3
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
  multi_az                = false  # Single AZ for staging

  # Staging: no deletion protection for easier cleanup
  deletion_protection       = false
  skip_final_snapshot       = true
  final_snapshot_identifier = null

  storage_encrypted = true

  # Staging: no performance insights to save costs
  performance_insights_enabled = false

  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.environment}-${var.project_name}-postgres"
  }
}

###############################################################################
###############################################################################
# Redis (Staging) #############################################################
###############################################################################
###############################################################################

resource "aws_security_group" "redis" {
  name        = "${var.environment}-${var.project_name}-redis-sg"
  description = "Security group for ElastiCache Redis cluster"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Redis from VPC"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-${var.project_name}-redis-sg"
  }
}

resource "aws_elasticache_subnet_group" "main" {
  name = "${var.environment}-${var.project_name}-redis-subnet-group"

  subnet_ids = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  tags = {
    Name = "${var.environment}-${var.project_name}-redis-subnet-group"
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.environment}-${var.project_name}-redis"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.redis_node_type
  num_cache_nodes      = var.redis_num_cache_nodes
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  # Staging: shorter snapshot retention
  snapshot_retention_limit = 3
  snapshot_window          = "05:00-06:00"
  maintenance_window       = "Mon:06:00-Mon:07:00"

  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.environment}-${var.project_name}-redis"
  }
}
