import User from '#models/user'
import Task from '#models/task'
import type { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * El responsable que acompaña a cada tarea. Recorre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`; el estado de cada uno está en
 * `docs/verificacion/pm.md`.
 *
 * Quien consulta es siempre otra cuenta distinta del responsable: el requisito
 * habla del responsable de la tarea, no de la cuenta que mira, y con la misma
 * cuenta en los dos papeles el test no distinguiría una cosa de la otra.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function tareaDeOtraCuenta(
    client: ApiClient,
    responsable: { fullName: string | null; email: string }
  ) {
    const asignado = await User.create({
      fullName: responsable.fullName,
      email: responsable.email,
      password: 'secreto123',
    })
    await User.create({
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'secreto123',
    })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'grace@example.com', password: 'secreto123' })
    const token = login.body().data.token as string

    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: asignado.id,
    })

    return { token, taskId: task.id }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { token, taskId } = await tareaDeOtraCuenta(client, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
    })

    const response = await client
      .get(`/api/v1/tasks/${taskId}`)
      .qs({ today: '2026-08-13' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const assignee = response.body().data.assignee
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('la tarea no expone el email ni datos de acceso del responsable', async ({
    client,
    assert,
  }) => {
    const { token, taskId } = await tareaDeOtraCuenta(client, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
    })

    const suelta = await client
      .get(`/api/v1/tasks/${taskId}`)
      .qs({ today: '2026-08-13' })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const deLaLista = (lista.body().data as any[]).find((tarea) => tarea.id === taskId)
    assert.exists(deLaLista)

    for (const tarea of [suelta.body().data, deLaLista]) {
      // El requisito deja al responsable en el nombre y las iniciales; nada más.
      assert.onlyProperties(tarea.assignee, ['fullName', 'initials'])
      assert.notInclude(JSON.stringify(tarea.assignee), 'ada@example.com')
    }
  })

  test('un responsable sin nombre llega con sus iniciales', async ({ client, assert }) => {
    const { token, taskId } = await tareaDeOtraCuenta(client, {
      fullName: null,
      email: 'sin-nombre@example.com',
    })

    const response = await client
      .get(`/api/v1/tasks/${taskId}`)
      .qs({ today: '2026-08-13' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const assignee = response.body().data.assignee
    assert.isNull(assignee.fullName)
    assert.equal(assignee.initials, 'SE')
  })
})
