# HardWire Infrastructure

<p align="center">
    <img
        src="https://github.com/user-attachments/assets/825e4c1a-c569-476e-89d4-42f1d9d4ea02"
        alt="Hardwire"
        height="70%"
        width="100%">
</p>

## Overview

This directory contains production-ready Terraform configurations demonstrating how to deploy the HardWire platform to [AWS](https://aws.amazon.com/). These configurations serve as reference architecture for enterprise deployments—suitable for `terraform plan` validation but should not be actively applied. The live HardWire demonstration is hosted on [Railway](https://railway.com/).

- **Responsibilities:**
  - VPC networking with public/private subnet isolation across 2 AZs
  - Container orchestration via AWS App Runner with GitHub auto-deploy
  - Managed database (RDS PostgreSQL 16, Multi-AZ) and cache (ElastiCache Redis 7.1)
  - Static site hosting via S3 + CloudFront with Origin Access Control
  - Secrets management via AWS Secrets Manager
  - CloudWatch monitoring, alarms, and dashboards
- **Non-goals:**
  - Does not manage DNS records or Route 53 hosted zones
  - Not actively deployed—this is reference architecture only

---

## Current Deployment

HardWire is deployed on [Railway](https://railway.com/) with the following configuration:

| Service | Root Dir | Builder / Build | Start | Watch Paths | Public Domain |
|---------|----------|-----------------|-------|-------------|---------------|
| backend | /backend | Dockerfile | Dockerfile CMD | /backend/** | api.hardwire.branmcf.com |
| frontend | /frontend | Dockerfile | Dockerfile CMD | /frontend/** | app.hardwire.branmcf.com |
| marketing | /marketing | Nixpacks, `npm run build` | `npm run preview -- --host 0.0.0.0 --port $PORT` | /marketing/** | hardwire.branmcf.com |
| docs | /docs | Nixpacks, `pip install -r requirements.txt && mkdocs build` | `python -m http.server $PORT -d build` | /docs/** | docs.hardwire.branmcf.com |
| mcp-tools | /mcp-tools-server | Dockerfile | Dockerfile CMD | /mcp-tools-server/** | none (private) |

---

## Reviewer Notes

- **Run:** `cd infrastructure/environments/prod && terraform init && terraform plan`
- **What to look at first:**
  - `environments/prod/main.tf` — VPC, subnets, NAT gateways, route tables (core networking)
  - `environments/prod/app_runner.tf` — Three App Runner services with VPC connector, auto-scaling
  - `environments/prod/database.tf` — RDS PostgreSQL (Multi-AZ, encrypted) + ElastiCache Redis
- **What to judge:**
  - **Network isolation:** Private subnets for databases, VPC connector for App Runner → RDS/Redis
  - **Security posture:** Secrets in AWS Secrets Manager, no public DB access, TLS on CloudFront
  - **Scalability:** App Runner auto-scaling configs with min/max instances
  - **Operability:** CloudWatch alarms, 7-day backup retention, deletion protection enabled
  - **Environment parity:** `prod/` and `staging/` share identical structure

---

## Quick Start

> **Note:** This is reference architecture. HardWire is deployed on Railway, not AWS.

```bash
cd infrastructure/environments/prod
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
# terraform apply  # Reference only — not intended for actual deployment
```

### Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform) >= 1.1.0
- [AWS CLI](https://aws.amazon.com/cli/) configured with credentials
- [GitHub connection ARN](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-create-github.html)

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
    │   ├── outputs.tf                # Output values (URLs, ARNs)
    │   └── terraform.tfvars.example  # Example variable values
    └── staging/                      # Staging environment (identical structure)
        └── ...
```

---

## Tech Stack

| Tech | Role | Evidence | Why |
|------|------|----------|-----|
| **Terraform** | Infrastructure as Code | `main.tf:11` — `required_version = ">=1.1.0"` | Declarative, reproducible AWS provisioning |
| **AWS Provider** | Cloud platform | `main.tf:15-18` — `hashicorp/aws ~> 5.0` | Managed services, multi-AZ support |
| **VPC** | Network isolation | `main.tf` — 10.0.0.0/16 CIDR, 4 subnets | Public/private subnet separation |
| **App Runner** | Container orchestration | `app_runner.tf` — 3 services with VPC connector | Auto-deploy from GitHub, built-in scaling |
| **RDS PostgreSQL 16** | Primary database | `database.tf:54` — Multi-AZ, gp3 storage | Managed backups, encryption, Performance Insights |
| **ElastiCache Redis 7.1** | Caching | `database.tf` — single node cluster | Session store, rate limiting |
| **S3 + CloudFront** | Static hosting | `marketing.tf`, `docs.tf` | Origin Access Control, HTTPS-only |
| **Secrets Manager** | Secrets storage | `secrets.tf` | Runtime secrets injection into App Runner |
| **CloudWatch** | Monitoring | `logging.tf` | CPU/memory alerts, SNS notifications |

---

## System Context

### Provides

- Production-ready AWS infrastructure blueprint for HardWire
- App Runner service definitions for backend, frontend, and MCP tools
- CloudFront distributions for static sites (marketing, docs)

### Depends on

- AWS account with appropriate IAM permissions
- GitHub connection (manual setup in AWS Console)
- ACM certificates in `us-east-1` (only for custom domains)

### Interfaces

- **App Runner → RDS:** VPC connector routes traffic through private subnets (port 5432)
- **App Runner → Redis:** Same VPC connector, security group allows port 6379
- **CloudFront → S3:** Origin Access Control, private bucket access only

---

## Key Concepts

### 1. VPC Connector for App Runner

**What it does:** Routes egress traffic from App Runner through private subnets to reach RDS and Redis.

**Why it exists:** App Runner runs outside VPC by default; connector enables private resource access.

**Evidence:** `environments/prod/app_runner.tf:38-56`

### 2. Secrets Injection via Secrets Manager

**What it does:** Stores DATABASE_URL and API keys in Secrets Manager; App Runner pulls at runtime.

**Why it exists:** Avoids hardcoding secrets in Terraform state or environment variables.

**Evidence:** `environments/prod/secrets.tf`

### 3. Origin Access Control for Static Sites

**What it does:** S3 buckets are private; only CloudFront can read via OAC.

**Why it exists:** Prevents direct S3 access, enforces HTTPS and caching policies.

**Evidence:** `environments/prod/marketing.tf`, `environments/prod/docs.tf`

### 4. Multi-AZ Database with Automatic Failover

**What it does:** RDS PostgreSQL deployed across two availability zones.

**Why it exists:** High availability—automatic failover if primary AZ fails.

**Evidence:** `environments/prod/database.tf:88` — `multi_az = true`

---

## Tests

This codebase has no tests.

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

1. **Add WAF (Web Application Firewall)**
   - Why: Rate limiting at edge, SQL injection protection.
   - Where: Attach to CloudFront distributions

2. **Add infrastructure tests with Terratest**
   - Why: Validate infrastructure changes before apply.
   - Where: New `tests/` directory with Go-based Terratest suite
