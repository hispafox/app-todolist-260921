import { expect, test, type Page } from '@playwright/test'

// Título único por ejecución para no chocar con datos existentes ni entre tests.
function uniqueTitle(prefix: string): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

async function createTask(
  page: Page,
  title: string,
  options: { description?: string; category?: string; priority?: 'Alta' | 'Media' | 'Baja' } = {},
): Promise<void> {
  await page.getByLabel('Título *').fill(title)
  if (options.description) {
    await page.getByLabel('Descripción').fill(options.description)
  }
  if (options.category) {
    await page.getByLabel('Categoría').fill(options.category)
  }
  if (options.priority) {
    await page.getByLabel('Prioridad').selectOption({ label: options.priority })
  }
  await page.getByRole('button', { name: 'Crear tarea' }).click()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
}

function taskCard(page: Page, title: string) {
  return page.locator('article').filter({ hasText: title })
}

async function deleteTask(page: Page, title: string): Promise<void> {
  await taskCard(page, title).getByRole('button', { name: `Eliminar ${title}` }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Eliminar' }).click()
  await expect(page.getByRole('heading', { name: title })).toHaveCount(0)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /haz espacio para lo que importa/i })).toBeVisible()
})

test('crea una tarea y la elimina con confirmación', async ({ page }) => {
  const title = uniqueTitle('E2E crear')

  await createTask(page, title, { description: 'Descripción de prueba', category: 'E2E' })
  await expect(taskCard(page, title).getByText('E2E')).toBeVisible()

  await deleteTask(page, title)
})

test('completa y reabre una tarea', async ({ page }) => {
  const title = uniqueTitle('E2E ciclo')
  await createTask(page, title)

  const card = taskCard(page, title)
  await card.getByRole('checkbox', { name: `Completar ${title}` }).click()
  await expect(card.getByRole('checkbox', { name: `Reabrir ${title}` })).toBeChecked()

  await card.getByRole('checkbox', { name: `Reabrir ${title}` }).click()
  await expect(card.getByRole('checkbox', { name: `Completar ${title}` })).not.toBeChecked()

  await deleteTask(page, title)
})

test('edita una tarea existente', async ({ page }) => {
  const title = uniqueTitle('E2E editar')
  const editedTitle = `${title} (editada)`
  await createTask(page, title)

  await taskCard(page, title).getByRole('button', { name: `Editar ${title}` }).click()
  await expect(page.getByRole('heading', { name: /actualiza los detalles/i })).toBeVisible()

  await page.getByLabel('Título *').fill(editedTitle)
  await page.getByRole('button', { name: 'Guardar cambios' }).click()

  await expect(page.getByRole('heading', { name: editedTitle })).toBeVisible()
  await deleteTask(page, editedTitle)
})

test('busca y filtra sin recargar la página', async ({ page }) => {
  const title = uniqueTitle('E2E buscar')
  await createTask(page, title, { priority: 'Alta' })

  await page.getByRole('searchbox', { name: /buscar tareas/i }).fill(title)
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  // Un término inexistente deja la lista sin coincidencias.
  await page.getByRole('searchbox', { name: /buscar tareas/i }).fill('zzz-no-existe-zzz')
  await expect(page.getByText(/no hay coincidencias/i)).toBeVisible()

  // Se limpia la búsqueda para poder eliminar la tarea creada.
  await page.getByRole('searchbox', { name: /buscar tareas/i }).fill(title)
  await deleteTask(page, title)
})
