# Landing Page Implementation TODO

## Instructions for Implementation

### Reference File
All styling, classes, and structure MUST match `REFERENCE.html` exactly. This is the source of truth for pixel-perfect replication.

### How to Use This Document
When asked to implement a task (e.g., "Add task 2"), follow these steps:

1. **Read the REFERENCE.html** at the specified line numbers for that task
2. **Copy the exact HTML structure** including all classes, attributes, and nesting
3. **Preserve all class names exactly** - they map to the Webflow CSS
4. **Keep all inline styles** - they control animations and transforms
5. **Maintain data attributes** - especially `data-w-id`, `arrow-color`, `text-color`, `border-color`
6. **Use the exact copy/text** provided in this document

### CSS Dependencies
The page relies on external Webflow CSS. Ensure this stylesheet is included:
```html
<link href="https://cdn.prod.website-files.com/6941d3d746b6bf0ea90b8ecf/css/tensorlake-staging.webflow.shared.11a90667e.css" rel="stylesheet" type="text/css" />
```

### Global Styles
Copy the entire `<style>` block from lines 69-747 in REFERENCE.html. This includes:
- Button hover states and color variants
- Grid patterns
- Logo animations
- Vertical loop animations
- Footer loop animations
- CTA line animations
- Form input styles
- Code block styles

### Animation Classes
- `fade-up` - Elements that animate on scroll
- `active` - Toggle state for tabs/images
- `hide` - Hidden elements (some sections are hidden by default)

---

## Task List

### Task 0: Page Wrapper & Navigation
**Lines:** 67-846
**Status:** [ ] Not Started

**Structure:**
```
div.page-wrapper
  div.global-styles.w-embed (contains all CSS)
  main.main-wrapper
    div.nav_component
```

**Key Elements:**
- Logo: `nav-brand` linking to `/`
- Dropdown menu for PRODUCT (Document AI, Agentic Applications)
- Nav links: Blog, Pricing, Careers, Docs
- Buttons: Log in, BOOK A DEMO
- Mobile menu toggle

**Classes:** `nav_component`, `padding-global`, `nav-container`, `nav-left`, `nav-brand`, `nav-logo`, `nav-menu`, `dropdown`, `nav-link`, `nav-dropdown`, `nav-dropdown-item`, `button-group`, `button`, `menu-button`

---

### Task 1: Hero Section
**Lines:** 847-938
**Status:** [x] Complete

**Section Class:** `section is-homehero`

**Content:**
- H1: "The Engine for Agentic Work"
- Paragraph: "The complete platform for deploying production agents in the enterprise. Durable execution, document ingestion, and multi-cloud compute — all built-in so you focus on your application, not infrastructure."
- CTA Button: "TRY TENSORLAKE" → https://cloud.tensorlake.ai/

**Key Classes:**
- `container-xlarge`
- `homehero_component`
- `homehero-content`
- `flex-vertical align-center`
- `heading-style-h1`
- `text-style-muted`
- `button-group`
- `grid` (background grid pattern)

**Animation Elements:**
- H1, paragraph, and button group all have inline transform styles for fade-up animation
- Video embed with autoplay, muted, loop, playsinline

**Video Source:** `https://pub-26ea6282fa24439493c91bf324dd1256.r2.dev/1.5.mp4`

---

### Task 2: Stats Section
**Lines:** 939-968
**Status:** [x] Complete

**Section Class:** `section`

**Content (4 stat items):**
1. "ACTIVE AGENT SESSIONS: 180" (bolt icon)
2. "AVG DISPATCH LATENCY: 90ms" (bolt icon)
3. "SYSTEM STATUS: 100% OPERATIONAL" (green highlight)
4. "DOCUMENTS PARSED: 500,922,040" (green highlight)

**Key Classes:**
- `container-xlarge`
- `hero-grid`
- `hero-grid-item is-1` / `is-2` / `is-3` / `is-4`
- `green-highlight-text`

**Icons:** Bolt icon from `https://cdn.prod.website-files.com/6941d3d746b6bf0ea90b8ecf/6945d3dc7ee51b306d0805a9_bolt-icon.svg`

---

### Task 3: Logo Cloud (Hidden)
**Lines:** 969-1133
**Status:** [ ] Not Started

**Section Class:** `section background-color-white hide`

**Note:** This section has the `hide` class - it's hidden by default.

**Content:**
- Header: "POWERING WORLD CLASS TEAMS:"
- Scrolling logo carousel with case study links

**Key Classes:**
- `padding-global padding-section-small`
- `container-large`
- `logos_module`
- `logos-module-header`
- `vertical-infinite-loop`
- `logos_component`
- `logos-cms-item`
- `logo-item`
- `case-study-tag`

---

### Task 4: OUR PRODUCTS [01] - Agent Platform
**Lines:** 1134-1399
**Status:** [x] Complete

**Section Class:** `section background-color-lightgray`

**Subhead:** "OUR PRODUCTS [01]"
**Heading:** "The Production Stack For Agents"
**CTA:** "VIEW PRODUCT BREAKDOWN" → /agentic-applications

**Feature Tabs (4 items):**
1. "Never lose progress" - Durable execution keeps state across every tool call...
2. "Accurate Document Ingestion" - Clean data in, good decisions out...
3. "Stay fast under load" - Predictable throughput means fresh sessions spin up immediately...
4. "Code Sandboxes" - Run generated code safely...

**Feature Grid Heading:** "Deploy Durable Agents as APIs written in any framework"

**Feature Grid Items (3):**
1. "PROOF OF INCOME VERIFICATION" - Process pay stubs, tax forms and bank statements...
2. "INSURANCE CLAIM PROCESSING" - Ingest claim documents, pull key fields...
3. "CONTRACT REVIEW" - Read through agreements, flag key clauses...

**Key Classes:**
- `padding-global padding-section-large`
- `container-large`
- `feature_component`
- `feature-left`
- `subhead_component`
- `subhead-text`
- `heading-style-h3`
- `feature-tabs-menu`
- `feature-tabs-menu-header`
- `feature-tabs-menu-item`
- `feature-tabs-menu-item-top`
- `feature-tabs-menu-item-bottom`
- `divider is-white`
- `feature-image-content`
- `feature-image-wrapper active`
- `feature-grid`
- `feature-grid-item`

**Tab Icons:**
- Progress: `6945e5e4880acdd473a4632d_progress-icon.svg`
- Clock: `694ad922108ecb0319e9175b_clock.svg`
- Block: `694ad9223ceb86bac1fbe726_block.svg`

---

### Task 5: OUR PRODUCTS [02] - Document Ingestion
**Lines:** 1400-1654
**Status:** [x] Complete

**Section Class:** `section`

**Subhead:** "OUR PRODUCTS [02]"
**Heading:** "Frontier Document Ingestion API"
**Description:** "A comprehensive toolbox of APIs for accurate Document Understanding to speed up building AI Workflows and Agents in Enterprises for back-office use-cases"
**CTA:** "VIEW PRODUCT BREAKDOWN" → /document-ingestion

**Feature Tabs (4 items):**
1. "Layout Aware Parsing" - Read Documents with complex layouts...
2. "Read Images and Charts" - Summarize meaning of figures, charts and tables...
3. "Structured Extraction" - Extracts structured data from documents guided by JSON Schema
4. "Document Classification" - Read Documents with complex layouts...

**Feature Grid Heading:** "Document Ingestion enables building Agentic automation faster"

**Feature Grid Items (3):**
1. "FINANCE" - Extract key insights, complex tables and charts from investor decks...
2. "HEALTHCARE" - Handle low-quality faxes, handwritten notes...
3. "INSURANCE" - Parse complex intake files into labeled claims data...

**Key Classes:**
- `feature-tabs-menu is-dark`
- `feature-tabs-menu-header is-dark`
- `divider is-black`
- `feature-image-wrapper is-dark active`
- `feature-grid-item is-dark`

---

### Task 6: Everything You Need Section
**Lines:** 1655-1759
**Status:** [x] Complete

**Section Class:** `section background-color-lightgray overflow-hidden`

**Subhead:** "BATTERIES INCLUDED PLATFORM FOR AI WORKFLOWS"
**Heading:** "Everything you need for Agents in Enterprises"

**4 Feature Items:**
1. "DOCUMENT INGESTION" - Understanding Documents is the biggest bottleneck...
2. "DURABLE AGENTIC RUNTIME" - An application runtime to run serverless agents...
3. "CODE SANDBOXES" - Code Sandboxes enable your agents to run untrusted LLM generated code...
4. "DURABLE DATA WORKFLOWS" - Build large scale data ingestion and ETL workflows...

**Key Classes:**
- `dotted-divider` (top and bottom)
- `everything_component`
- `everything-items-wrapper`
- `everything-item`
- `everything-item is-2`
- `everything-line`
- `everything-full-line is-full`
- `everything-image-wrapper`
- `subhead-large`

**Center Image:** `6945ef73bd7d31468c9af6d4_everything-feature-image.svg`

---

### Task 7: Product Feature Cards (5 Products)
**Lines:** 1760-2193
**Status:** [x] Complete

**Section Class:** `section`

**Contains 5 `feature-alt_component` blocks:**

#### 7a. Serverless Compute
**Subhead:** "PRODUCT"
**Heading:** "Serverless Compute for your High Throughput Agents"
**Description:** Tensorlake's compute platform lets you deploy agents on a serverless runtime...

**Stats:**
- "< 100 ms" - Average request dispatch time
- "10,000+" - Number of concurrent requests
- "< 5 GB" - Function Input/Output payload size

#### 7b. Durable Execution
**Subhead:** "PRODUCT"
**Heading:** "Durable Execution"
**Description:** Agents runs for minutes, makes 100s of tool calls along the way...

**Stats:**
- "Automatic Durability" - State and function calls are automatically checkpointed...
- "Durable Timers" - Pause functions to start after weeks or months

**Note:** Uses `feature-alt-wrapper is-flipped` for reversed layout

#### 7c. Document Ingestion - OCR
**Subhead:** "PRODUCT"
**Heading:** "Document Ingestion - OCR Infused with VLMs"
**Description:** We use VLMs with OCRs to read Documents the way humans do...

**Stats:**
- "Visual Citations" - Every extracted field links back to its exact location...
- "30+ formats supported" - PDFs, spreadsheets, presentations...

#### 7d. Sandboxes for Agents
**Subhead:** "PRODUCT"
**Heading:** "Sandboxes for Agents"
**Description:** Execute LLM generated code in isolated sandboxes...

**Stats:**
- "BYOC In Your Cloud" - Tensorlake can spin up sandboxes in your cloud...
- "Unlimited Sandboxes" - No limits on number of active sandboxes...

**Note:** Uses `feature-alt-wrapper is-flipped`

#### 7e. Fits Into Your Stack
**Subhead:** "PRODUCT"
**Heading:** "Fits Into Your Stack Seamlessly"
**Description:** You can integrate Document AI into your workflows using our HTTP APIs

**Stats:**
- "Runs on Any Cloud" - Use Tensorlake on our SAAS or deploy In-VPC...
- "Framework Agnostic" - Agent and Workflow Runtimes are framework agnostic...

**Key Classes:**
- `container-large is-line-dark`
- `feature-alt_component`
- `feature-alt-wrapper` / `feature-alt-wrapper is-flipped`
- `feature-alt-left-wrapper`
- `feature-alt-image-wrapper`
- `feature-alt-left-items` / `feature-alt-left-items is-3`
- `feature-alt-left-item`
- `feature-alt-content`
- `subhead_component`
- `subhead-text is-swamp`
- `heading-style-h4`
- `feature-bottom`

---

### Task 8: CTA Section
**Lines:** 2194-2260
**Status:** [x] Complete

**Section Class:** `section overflow-hidden`

**Heading:** "Get server-less runtime for agents and data ingestion"
**Subtext:** "Get Durable Agents and Data Ingestion Workflows with zero infrastructure"

**CTAs:**
- "TRY TENSORLAKE" → https://cloud.tensorlake.ai/
- "REQUEST A DEMO" → https://calendly.com/diptanu-tensorlake/30min

**Key Classes:**
- `container-large is-line-dark`
- `container-cta is-line`
- `cta_component`
- `cta-lines_component`
- `cta-lines-wrapper`
- `cta-lines-image` (animated horizontal scroll)
- `cta-lines-logo`
- `cta-content-wrapper`
- `cta-wrapper`
- `cta-grid`
- `cta-full-line is-1` / `is-2`

**Logo:** `69535006105d882976f28814_cta-logo.svg`
**Lines SVG:** `69535185829b5e2731ac841d_cta-lines.svg`

---

### Task 9: Testimonials Section
**Lines:** 2261-2435
**Status:** [x] Complete

**Section Class:** `section background-color-lightgray z-index-1`

**Subhead:** "TRUSTED BY PRO DEVS GLOBALLY"
**Description:** "Tensorlake is the Agentic Compute Runtime the durable serverless platform that runs Agents at scale."

**Testimonials (5 slides):**

1. **Vincent Di Pietro** - Founder, Novis AI
   > "With Tensorlake, we've been able to handle complex document parsing and data formats that many other providers don't support natively..."

2. **Boyan Dimitrov** - CTO, Sixt
   > "At SIXT, we're building AI-powered experiences for millions of customers..."

3. **Yaroslav Sklabinskyi** - Principal Software Engineer, Reliant AI
   > "Tensorlake enabled us to avoid building and operating an in-house OCR pipeline..."

4. **Cristian Joe** - CEO @ BindHQ
   > "For BindHQ customers, the integration with Tensorlake represents a shift from manual data handling..."

5. **Arpan Bhattacharya** - CEO, The Intelligent Search Company
   > "Tensorlake let us ship faster and stay reliable from day one..."

**Key Classes:**
- `grid is-white`
- `container-large is-line-white background-color-lightgray`
- `testimonials_component`
- `testimonial-slider`
- `fs-slider_instance`
- `fs-slider_list-wrapper`
- `fs-slider_slide`
- `testimonial-slide-item`
- `heading-style-h5 is-testimonial`
- `testimonial-person-title`
- `fs-slider_navigation`
- `fs-slider_pagination`
- `fs-slider_pagination_bullet`

**Note:** Uses Finsweet slider component with `fs-slider-*` attributes

---

### Task 10: Data Workflows Section
**Lines:** 2436-2751
**Status:** [x] Complete

**Section Class:** `section`

**Subhead:** "DATA WORKFLOWS"
**Heading:** "The All-In-One Runtime for AI Data Workflows"

**Grid Items (4):**
1. "1TB BUILT-IN QUEUE" - Built-in 1TB persistence layer...
2. "NO-SQL PARALLELISM" - Achieve data-warehouse concurrency directly in Python...
3. "90,000 REQ/SEC" - Concurrent invocations per workflow...
4. "SERVERLESS COMPUTE" - Attach H100 GPUs to any step...

**Code Block (center graphic):**
```python
from tensorlake import function, File

@function()
def download_dataset(path: str) -> List[File]:
    images = load_images(path)
    return [pre_process_image(image) for image in images]

@function(gpu="A10")
def detect_objects(image: PIL.Image) -> Detection:
    detection = yolo(image)
    return detection

@function()
def write_to_db(detection: Detection):
    psql.write(dection)
```

**Key Classes:**
- `container-large is-line-dark`
- `divider is-black`
- `workflows_component`
- `workflow-grid-item`
- `data-workflow-graphic`
- `data-workflow-graphic-top`
- `data-workflow-graphic-content`
- `text-color-swamp`
- `text-color-green-1`
- `text-color-green-2`

**Note:** Also contains hidden "CUSTOMER STORIES" section (has `hide` class)

---

### Task 11: Security Section
**Lines:** 2752-2876
**Status:** [x] Complete

**Section Class:** `section background-color-lightgray overflow-hidden`

**Subhead:** "SECURITY"
**Heading:** "Security Built for Agentic and AI Data Workflows"
**CTA:** "LEARN MORE" → https://calendly.com/diptanu-tensorlake/30min

**Security Items (5):**
1. "Tracing and Observability" - Full traces of every function and tool call...
2. "Sandbox for tool calls" - Tool calls run in isolated sandboxes...
3. "Sandbox for agent harness" - Each agent harness executes inside an isolated sandbox...
4. "HIPAA / SOC2 Type2 Compliant" - Secure by default for PHI, PII...
5. "Isolated & Auditable Data Boundaries" - Each project's data lives in its own isolated bucket...

**Key Classes:**
- `container-large is-line-white`
- `security_component`
- `security-grid-item`
- `security-image-wrapper`
- `security-image`
- `text-size-medium text-style-muted`
- `text-size-small`

**Center Image:** `694608b20da4d17f11682f10_security-image.svg`

---

### Task 12: Newsletter Section
**Lines:** 2879-2936
**Status:** [x] Complete

**Section Class:** `section background-color-lightgray`

**Header:** "SUBSCRIBE FOR NEWS & MORE"
**Subhead:** "The Document Digest"
**Heading:** "Join our newsletter for the latest product updates"

**Form Fields:**
- Email input (placeholder: "youremail@gmail.com")
- Full Name input (placeholder: "Full Name")
- Submit button: "Sign up"

**Key Classes:**
- `padding-global padding-section-medium`
- `newsletter_component`
- `newsletter-header`
- `vertical-infinite-loop is-newsletter`
- `newsletter-wrapper`
- `form_component is-newsletter`
- `form_form is-newsletter`
- `form_input`
- `button is-form-submit`
- `form_message-success`
- `form_message-error`

**Note:** Preceded by `big-divider` element (line 2877-2878)

---

### Task 13: Footer Section
**Lines:** 2937-3054
**Status:** [x] Complete

**Section Class:** `section is-footer`

**Top Content:**
- Subhead: "THE AI PLATFORM FOR YOUR AGENTIC APPLICATIONS"
- Heading: "Ship AI Automation Faster With Tensorlake"

**Footer Grid (4 columns):**

**COMPANY:**
- Blog → /blog
- Pricing → /pricing
- Careers → /careers
- Documentation → https://docs.tensorlake.ai/introduction
- Contact Sales → https://calendly.com/diptanu-tensorlake/30min

**PRODUCTS:**
- Document AI → /document-ingestion
- Agentic Application → /agentic-applications

**DEVELOPERS:**
- Changelog → /changelog
- Status Page → https://status.tensorlake.ai/

**SOCIAL:**
- Twitter → https://x.com/tensorlake
- Slack → (slack invite link)
- LinkedIn → https://www.linkedin.com/company/tensorlake/
- GitHub → https://github.com/tensorlakeai
- Bluesky → https://bsky.app/profile/tensorlake.ai

**Copyright:** "[ TENSORLAKE INC. ] HQ: SF / TEAM: GLOBAL_"

**Footer Animation:** Scrolling lines animation with `footer-loop-wrapper`

**Key Classes:**
- `padding-global padding-section-footertop`
- `padding-global padding-section-footerbottom`
- `footer-grid`
- `footer-column`
- `footer-link`
- `footer-copyright`
- `green-highlight-text`
- `footer-loop-wrapper`
- `footer-loop-image-wrapper`
- `footer-loop-image`

**Footer Lines SVG:** `69534c779f0c80f299b83329_footer-lines.svg`

---

## JavaScript Dependencies

### Task 14: Interactive Scripts
**Lines:** 3076-3199+
**Status:** [ ] Not Started

**Required Scripts:**

1. **Feature Tabs Accordion** (lines 3076-3113)
   - Toggles `active` class on feature images
   - Expands/collapses feature tab content
   - Handles resize events

2. **Code Block Title Parser** (lines 3114-3199)
   - Extracts titles from code blocks using `[.code-block-title]` markers
   - Handles Prism syntax highlighting

**External Dependencies:**
- jQuery 3.5.1
- Webflow JS chunks
- Finsweet Attributes (for slider)

---

## Quick Reference: Common Button Patterns

### Primary CTA (Green)
```html
<a arrow-color="green 1" text-color="green 1" border-color="green 1" href="..." class="button w-inline-block">
    <div class="button-text">BUTTON TEXT</div>
    <div class="button-arrow w-embed"><!-- SVG arrow --></div>
</a>
```

### Secondary CTA (White)
```html
<a arrow-color="white" text-color="white" border-color="white" href="..." class="button w-inline-block">
    <div class="button-text">BUTTON TEXT</div>
</a>
```

### Dark Context CTA
```html
<a arrow-color="green 3" text-color="green 3" border-color="green 3" href="..." class="button w-inline-block">
    <div class="button-text">BUTTON TEXT</div>
    <div class="button-arrow w-embed"><!-- SVG arrow --></div>
</a>
```

---

## Arrow SVG (reuse everywhere)
```html
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.23438 2.63446C8.3844 2.48448 8.58784 2.40023 8.79998 2.40023C9.01211 2.40023 9.21555 2.48448 9.36558 2.63446L14.1656 7.43446C14.3156 7.58448 14.3998 7.78793 14.3998 8.00006C14.3998 8.21219 14.3156 8.41564 14.1656 8.56566L9.36558 13.3657C9.21469 13.5114 9.01261 13.592 8.80286 13.5902C8.5931 13.5884 8.39245 13.5042 8.24412 13.3559C8.09579 13.2076 8.01166 13.0069 8.00984 12.7972C8.00801 12.5874 8.08865 12.3853 8.23438 12.2345L11.6688 8.80006H2.39998C2.1878 8.80006 1.98432 8.71578 1.83429 8.56575C1.68426 8.41572 1.59998 8.21223 1.59998 8.00006C1.59998 7.78789 1.68426 7.58441 1.83429 7.43438C1.98432 7.28435 2.1878 7.20006 2.39998 7.20006H11.6688L8.23438 3.76566C8.0844 3.61564 8.00015 3.41219 8.00015 3.20006C8.00015 2.98793 8.0844 2.78448 8.23438 2.63446Z" fill="currentColor"></path>
</svg>
```
