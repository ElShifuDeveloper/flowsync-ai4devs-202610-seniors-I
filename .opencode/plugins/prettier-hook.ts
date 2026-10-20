import type { Plugin } from "@opencode-ai/plugin"

// Formatea el frontend cada vez que el agente edita un archivo dentro de frontend/src.
// El frontend no trae formateador propio: usamos el Prettier instalado en frontend/.
export const PrettierHook: Plugin = async ({ $, directory }) => {
  return {
    "file.edited": async (input) => {
      const path = input.path ?? ""
      if (!path.includes("/frontend/src/")) return
      if (!/\.(ts|tsx|js|jsx|css|json)$/.test(path)) return
      try {
        await $`cd ${directory}/frontend && npx prettier --write ${path}`
      } catch (err) {
        console.error("[prettier-hook] no se pudo formatear", path, err)
      }
    },
  }
}
