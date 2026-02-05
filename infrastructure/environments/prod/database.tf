###############################################################################
###############################################################################
# Database Security Group #####################################################
###############################################################################
###############################################################################

# define a security group for the PostgreSQL database
resource "aws_security_group" "postgres" {

  # set the name and description of the security group
  name        = "${var.environment}-${var.project_name}-postgres-sg"
  description = "Security group for PostgreSQL RDS database"

  # associate with the VPC
  vpc_id = aws_vpc.main.id

  # allow inbound PostgreSQL traffic from the VPC CIDR block
  ingress {
    description = "PostgreSQL from VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  # allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # tag the security group for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-postgres-sg"
  }
}

###############################################################################
###############################################################################
# RDS PostgreSQL Database #####################################################
###############################################################################
###############################################################################

# define a resource for an AWS RDS PostgreSQL instance
resource "aws_db_instance" "postgres" {

  # set the database instance identifier for identification
  identifier = "${var.environment}-${var.project_name}-postgres"

  # set the database engine to PostgreSQL
  engine         = "postgres"
  engine_version = "16.4"

  # set the instance class (size) for the database
  instance_class = var.db_instance_class

  # set the allocated storage in gigabytes
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage

  # set the storage type for better performance
  storage_type = "gp3"

  # set the database name, username, and password
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  # place the database in the private subnet group
  db_subnet_group_name = aws_db_subnet_group.main.name

  # associate with VPC security group
  vpc_security_group_ids = [aws_security_group.postgres.id]

  # disable public accessibility (database is only accessible within VPC)
  publicly_accessible = false

  # enable automated backups with 7-day retention
  backup_retention_period = 7
  backup_window           = "03:00-04:00"

  # set maintenance window
  maintenance_window = "Mon:04:00-Mon:05:00"

  # enable Multi-AZ deployment for high availability in production
  multi_az = true

  # enable deletion protection for production (set to false for easier cleanup during development)
  deletion_protection = true

  # skip final snapshot when destroying (set to false for production)
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.environment}-${var.project_name}-postgres-final-snapshot"

  # enable storage encryption
  storage_encrypted = true

  # enable performance insights for monitoring
  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  # enable enhanced monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # enable auto minor version upgrades
  auto_minor_version_upgrade = true

  # tag the database instance for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-postgres"
  }
}

###############################################################################
###############################################################################
# RDS Enhanced Monitoring IAM Role ############################################
###############################################################################
###############################################################################

# define IAM role for RDS enhanced monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "${var.environment}-${var.project_name}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.environment}-${var.project_name}-rds-monitoring-role"
  }
}

# attach the AWS managed policy for RDS enhanced monitoring
resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

###############################################################################
###############################################################################
# Redis Security Group ########################################################
###############################################################################
###############################################################################

# define a security group for Redis
resource "aws_security_group" "redis" {

  # set the name and description of the security group
  name        = "${var.environment}-${var.project_name}-redis-sg"
  description = "Security group for ElastiCache Redis cluster"

  # associate with the VPC
  vpc_id = aws_vpc.main.id

  # allow inbound Redis traffic from the VPC CIDR block
  ingress {
    description = "Redis from VPC"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  # allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # tag the security group for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-redis-sg"
  }
}

###############################################################################
###############################################################################
# ElastiCache Redis Subnet Group ##############################################
###############################################################################
###############################################################################

# define an ElastiCache subnet group
resource "aws_elasticache_subnet_group" "main" {

  # set the name of the subnet group
  name = "${var.environment}-${var.project_name}-redis-subnet-group"

  # set the subnet IDs to include in this subnet group
  subnet_ids = [
    aws_subnet.private_one.id,
    aws_subnet.private_two.id
  ]

  # tag the subnet group for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-redis-subnet-group"
  }
}

###############################################################################
###############################################################################
# ElastiCache Redis Cluster ###################################################
###############################################################################
###############################################################################

# define an ElastiCache Redis cluster
resource "aws_elasticache_cluster" "redis" {

  # set the cluster ID for identification
  cluster_id = "${var.environment}-${var.project_name}-redis"

  # set the engine to Redis
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.redis_node_type
  num_cache_nodes      = var.redis_num_cache_nodes
  parameter_group_name = "default.redis7"
  port                 = 6379

  # place the cluster in the private subnet group
  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  # set snapshot retention for backups (days)
  snapshot_retention_limit = 7
  snapshot_window          = "05:00-06:00"

  # set maintenance window
  maintenance_window = "Mon:06:00-Mon:07:00"

  # enable auto minor version upgrades
  auto_minor_version_upgrade = true

  # tag the cluster for identification
  tags = {
    Name = "${var.environment}-${var.project_name}-redis"
  }
}
