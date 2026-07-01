export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CitationSource {
  id: string;
  title: string;
  location: string;
  confidence: number;
  type: "document" | "memory" | "conversation";
  snippet?: string;
}

export const mockSuggestedPrompts: SuggestedPrompt[] = [
  {
    id: "prompt-1",
    title: "Summarize Project Alpha",
    description: "Get a concise technical breakdown of the latest specifications and timeline.",
    iconName: "FileText",
  },
  {
    id: "prompt-2",
    title: "Explain PLC Logic",
    description: "Detailed explanation of the automation scripts for the factory floor.",
    iconName: "Cpu",
  },
  {
    id: "prompt-3",
    title: "Compare Electrical Standards",
    description: "Compare global wiring guidelines and load tolerances.",
    iconName: "SlidersHorizontal",
  },
  {
    id: "prompt-4",
    title: "Review Technical Documentation",
    description: "Verify compliance of cable specifications in manuals.",
    iconName: "BookOpen",
  },
];

export const mockCitations: CitationSource[] = [
  {
    id: "cite-1",
    title: "Electrical_Cable_Manual.pdf",
    location: "Page 18",
    confidence: 96,
    type: "document",
    snippet: "Cross-linked Polyethylene (XLPE) insulated cables possess exceptional electrical properties, high thermal resistance (up to 90°C), and resistance to environmental stress cracking.",
  },
  {
    id: "cite-2",
    title: "Project_Alpha_Specification.docx",
    location: "Section 4.2",
    confidence: 91,
    type: "document",
    snippet: "The secondary power bus loops for Project Alpha testing grids must employ XLPE cable runs rated for at least 15kV to minimize load losses.",
  },
  {
    id: "cite-3",
    title: "Platform Memory Graph",
    location: "Memory node #342",
    confidence: 89,
    type: "memory",
    snippet: "Project Alpha deployment specs require 15kV XLPE cables for grid testing.",
  },
  {
    id: "cite-4",
    title: "Previous Chat Discussion",
    location: "Session: 'Cable Selection'",
    confidence: 85,
    type: "conversation",
    snippet: "Discussed sizing guidelines for XLPE cores and grounding shielding limits.",
  },
];

export const mockPredefinedAnswers: Record<string, string> = {
  "Summarize Project Alpha": `### Project Alpha - Executive Summary

Project Alpha represents the core indexing layer of **Intellex AI**. It compiles separate folders of enterprise documents into a unified, high-performance semantic knowledge graph.

#### Key Specs & Status
* **Core Technology**: Next.js 15, PGVector, OpenAI text-embeddings-3-large.
* **Retrieval Speeds**: Sub-second search responses (< 200ms) across 10,000+ files.
* **Index Status**: Synced & optimized (Memory Health: **78%**).
* **Release Phase**: Beta testing scheduled for early Q3 2026.

#### Implementation Objectives
1. **Multi-Modal OCR**: Automatic text extraction from electrical and mechanical schematics.
2. **Memory Extraction**: Compile structural summaries to resolve context constraints.
3. **Teams Sharing**: Collaboration features for workspace shared folders.`,

  "Explain PLC Logic": `### PLC Automation Logic & Scripting

Programmable Logic Controllers (PLCs) run automation scripts sequentially. For Project Alpha systems, PLC logic monitors cable heat tolerances.

Here is a Structured Text (ST) load monitor block:

\`\`\`pascal
PROGRAM CableLoadMonitor
VAR
    CurrentLoad  : REAL := 42.5; // Staged Load (Amps)
    MaxLoadLimit : REAL := 50.0; // Tolerance limit (Amps)
    LoadExceeded : BOOL := FALSE;
END_VAR

IF CurrentLoad > MaxLoadLimit THEN
    LoadExceeded := TRUE;
    TriggerEmergencyAlarm(); // Safely shut down primary grid
ELSE
    LoadExceeded := FALSE;
END_IF;
\`\`\`

> *Note: ST logic is compiled into ladder configurations for Siemens S7 automated switch plates.*`,

  "Compare Electrical Standards": `### International Wiring Standards Comparison

A comparison of international guidelines for high-voltage XLPE cable installations:

| Standard | Region | Core Focus | Voltage Rating | Max Temperature |
| :--- | :--- | :--- | :--- | :--- |
| **IEC 60502** | Global / ISO | Power cables (1kV to 30kV) | Medium Voltage | 90°C (Operating) |
| **NEC Article 310** | North America | Conductors for general wiring | Low Voltage (<1kV) | 75°C - 90°C |
| **BS 7671** | United Kingdom | Requirements for installations | Low Voltage | 70°C (PVC) / 90°C |
| **VDE 0276** | Germany | Underground distribution | Medium/High Voltage | 90°C |

**Inductive Spacing**: Under **IEC 60502**, cable groupings must preserve minimum air spacing to prevent thermal coupling.`,

  "Review Technical Documentation": `### Technical Document Audit Report

I have audited the staged technical documentation for the **Electrical Engineering** workspace.

> **Key Finding**: Grounding shield guidelines in the *Electrical Cable Manual (Page 18)* conflict slightly with *Project Alpha Spec (Section 4.2)*. The manual recommends copper tape shields, whereas the spec demands wire braiding.

#### Remediation Guidelines
* **Material Sizing**: Confirm XLPE core diameters match standard IEC ratings.
* **Thermal Checks**: Verify current loads do not push core temperatures past **90°C** limits.
* **Corrosion Shielding**: Braided wire shielding is recommended for underground switch runs.`,
};

export const genericAnswer = `I have searched the **Intellex AI** knowledge base for your query. 

Based on the **Electrical Cable Manual (Page 18)** and **Project Alpha Specifications (Section 4.2)**, here is what was found:
1. **XLPE (Cross-linked Polyethylene)** insulation is selected for its thermal properties (operating limit up to 90°C).
2. Grounding shielding shielding is crucial to minimize signal attenuation and EMF inductive losses in adjacent wire runs.

Let me know if you would like me to extract specific calculation tables or format load bounds logic!`;
