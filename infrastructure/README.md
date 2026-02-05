# HardWire Infrastructure

<p align="center"> 
    <img 
        src="https://github.com/user-attachments/assets/825e4c1a-c569-476e-89d4-42f1d9d4ea02" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

Terraform configurations for deploying the Hardwire platform to AWS. Provisions a multi-AZ VPC with public/private subnets, App Runner services for backend/frontend/MCP tools, RDS PostgreSQL with ElastiCache Redis for data persistence, and S3 + CloudFront for static sites.

- **Responsibilities:**
  - VPC networking with NAT gateways for secure private subnet egress
  - Container orchestration via AWS App Runner (auto-deploy from GitHub)
  - Managed database (RDS PostgreSQL 16, Multi-AZ) and cache (ElastiCache Redis 7.1)
  - Static site hosting (marketing + docs) via S3 + CloudFront with Origin Access Control
  - Secrets management via AWS Secrets Manager
  - CloudWatch monitoring, alarms, and dashboards

- **Non-goals:**
  - Does not manage DNS records or Route 53 hosted zones (custom domains require manual ACM certificate setup)
  - Does not include CI/CD pipelines—deployment credentials are output for external use

---

## Reviewer Notes

- **Run:** `cd infrastructure/environments/prod && terraform init && terraform plan`
- **What to look at first:**
  - `environments/prod/main.tf` — VPC, subnets, NAT gateways, route tables (core networking)
  - `environments/prod/app_runner.tf` — Three App Runner services with VPC connector, auto-scaling, health checks
  - `environments/prod/database.tf` — RDS PostgreSQL (Multi-AZ, encrypted, Performance Insights) + ElastiCache Redis
- **What to judge:**
  - **Network isolation:** Private subnets for databases, VPC connector for App Runner ↔ RDS/Redis
  - **Security posture:** Secrets in AWS Secrets Manager, no public DB access, TLS 1.2+ on CloudFront
  - **Scalability:** App Runner auto-scaling configs with min/max instances and concurrency limits
  - **Operability:** CloudWatch alarms (CPU, memory, storage), SNS alerts, 7-day backup retention
  - **Environment parity:** `prod/` and `staging/` share identical structure (diff only in sizing defaults)

---

## Usage (Quick start)

### Prereqs

- Terraform >= 1.1.0
- AWS CLI configured with credentials
- GitHub connection ARN (create manually in AWS Console → App Runner → GitHub connections)

### Install

```bash
cd infrastructure/environments/prod
```

### Configure

Copy and edit the example variables file:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Required variables in `terraform.tfvars`:

| Variable | Description |
|----------|-------------|
| `db_password` | PostgreSQL master password |
| `github_connection_arn` | ARN from AWS App Runner GitHub connection |
| `better_auth_secret` | Secret key for Better Auth (generate: `openssl rand -base64 32`) |
| `mcp_tools_api_key` | API key for MCP tools authentication |

### Run

```bash
terraform init
terraform plan
terraform apply
```

---

## Repo Layout

```
infrastructure/
├── README.md
└── environments/
    ├── prod/                         # Production environment
    │   ├── main.tf                   # VPC, subnets, gateways, route tables
    │   ├── database.tf               # RDS PostgreSQL, ElastiCache Redis
    │   ├── app_runner.tf             # Backend, Frontend, MCP Tools services
    │   ├── marketing.tf              # S3 + CloudFront for marketing site
    │   ├── docs.tf                   # S3 + CloudFront for documentation site
    │   ├── iam.tf                    # IAM roles and policies
    │   ├── secrets.tf                # AWS Secrets Manager resources
    │   ├── logging.tf                # CloudWatch logs, alarms, dashboard
    │   ├── variables.tf              # Input variable definitions
    │   ├── outputs.tf                # Output values (URLs, ARNs, creds)
    │   └── terraform.tfvars.example  # Example variable values
    └── staging/                      # Staging environment (identical structure)
        └── ...
```

---

## Tech Stack

| Tech | Role | Evidence | Why |
|------|------|----------|-----|
| **Terraform** | Infrastructure as Code | `main.tf`, `required_version = ">=1.1.0"` | Declarative, reproducible AWS provisioning |
| **AWS VPC** | Network isolation | `main.tf` — 10.0.0.0/16 CIDR, 4 subnets | Multi-AZ with public/private subnet separation |
| **AWS App Runner** | Container orchestration | `app_runner.tf` — 3 services | Auto-deploy from GitHub, built-in scaling, no container registry needed |
| **RDS PostgreSQL 16** | Primary database | `database.tf` — Multi-AZ, gp3 storage | Managed backups, encryption, Performance Insights |
| **ElastiCache Redis 7.1** | Caching / rate limiting | `database.tf` — single node | Session store, rate limit counters |
| **S3 + CloudFront** | Static site hosting | `marketing.tf`, `docs.tf` | Origin Access Control, HTTPS-only, cache invalidation |
| **Secrets Manager** | Secrets storage | `secrets.tf` — DATABASE_URL, API keys | Runtime secrets injection into App Runner |
| **CloudWatch** | Monitoring | `logging.tf` — alarms, dashboard | CPU/memory/storage alerts, SNS notifications |
| **IAM** | Access control | `iam.tf` — least-privilege roles | App Runner instance role, RDS monitoring role, deploy users |

---

## System Context

### Provides

- Production-ready AWS infrastructure for the Hardwire platform
- App Runner service URLs for backend (`/api`), frontend, and MCP tools
- CloudFront URLs for marketing and documentation sites
- Deployment credentials (IAM access keys) for static site CI/CD

### Depends on

- AWS account with appropriate permissions
- GitHub connection (manual setup in AWS Console)
- ACM certificates in `us-east-1` (only if using custom domains)

### Interfaces

- **Backend → RDS:** VPC connector routes traffic through private subnets
- **Backend → Redis:** Same VPC connector, security group allows port 6379
- **Backend → MCP Tools:** Public HTTPS via App Runner URLs
- **Frontend → Backend:** `NEXT_PUBLIC_API_URL` injected at build time
- **Static sites → S3:** Origin Access Control (OAC), not public bucket access

---

## Key Concepts

### 1. VPC Connector for App Runner

**What it does:** Routes egress traffic from App Runner services through private subnets to reach RDS and Redis.

**Why it exists:** App Runner runs outside VPC by default; connector enables access to private resources without public exposure.

**Evidence:**
- `environments/prod/app_runner.tf:38-56` — `aws_apprunner_vpc_connector.main`
- `environments/prod/app_runner.tf:187-200` — backend network configuration

### 2. Secrets Injection via Secrets Manager

**What it does:** Stores sensitive values (DATABASE_URL, API keys) in Secrets Manager; App Runner pulls them at runtime.

**Why it exists:** Avoids hardcoding secrets in Terraform state or environment variables.

**Evidence:**
- `environments/prod/secrets.tf` — secret definitions
- `environments/prod/app_runner.tf:157-166` — `runtime_environment_secrets`

### 3. Origin Access Control for Static Sites

**What it does:** S3 buckets are private; only CloudFront can read via OAC.

**Why it exists:** Prevents direct S3 access, enforces HTTPS and caching policies.

**Evidence:**
- `environments/prod/marketing.tf` — `aws_cloudfront_origin_access_control`
- `environments/prod/docs.tf` — same pattern for docs site

### 4. Multi-AZ Database with Automatic Failover

**What it does:** RDS PostgreSQL deployed across two availability zones.

**Why it exists:** High availability—automatic failover if primary AZ fails.

**Evidence:**
- `environments/prod/database.tf:88` — `multi_az = true`
- `environments/prod/main.tf` — private subnets in `us-east-2a` and `us-east-2b`

### 5. CloudFront Function for Docs URL Rewriting

**What it does:** Rewrites clean URLs (e.g., `/guide/`) to `/guide/index.html` for MkDocs compatibility.

**Why it exists:** MkDocs generates `index.html` files in directories; CloudFront needs rewrite rules.

**Evidence:**
- `environments/prod/docs.tf` — `aws_cloudfront_function.docs_url_rewrite`

---

## Tests

No automated infrastructure tests found in repo.

**Validation commands:**

```bash
# Format check
terraform fmt -check -recursive

# Validate configuration
cd infrastructure/environments/prod
terraform init
terraform validate

# Plan (dry run)
terraform plan
```

---

## Future Work

1. **Add Terraform state backend (S3 + DynamoDB)**
   - Why: Currently uses local state; team collaboration requires remote state with locking.
   - Where: `environments/*/main.tf` — uncomment and configure `terraform { backend "s3" { ... } }`

2. **Add Route 53 hosted zone and DNS records**
   - Why: Custom domains require DNS records pointing to CloudFront/App Runner.
   - Where: New `dns.tf` file in each environment

3. **Add WAF (Web Application Firewall)**
   - Why: Rate limiting at edge, SQL injection protection, geographic restrictions.
   - Where: Attach to CloudFront distributions and App Runner services

4. **Add infrastructure tests with Terratest**
   - Why: Validate infrastructure changes before apply.
   - Where: New `tests/` directory with Go-based Terratest suite

5. **Add cost alerts via AWS Budgets**
   - Why: Early warning for unexpected cost increases.
   - Where: New `budgets.tf` file
