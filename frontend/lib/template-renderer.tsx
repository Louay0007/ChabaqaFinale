import { ModernTemplate } from "@/app/(community)/components/modern-template"
import { CreativeTemplate } from "@/app/(community)/components/creative-template"
import { MinimalTemplate } from "@/app/(community)/components/minimal-template"

export function getTemplateComponent(template: string) {
  switch (template) {
    case "creative":
      return CreativeTemplate
    case "minimal":
      return MinimalTemplate
    case "modern":
    default:
      return ModernTemplate
  }
}
