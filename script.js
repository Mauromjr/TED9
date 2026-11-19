const rel = document.getElementById('relogio')
const periodo = document.getElementById('periodo')
const form = document.getElementById('formulario')
const assunto = document.getElementById('assunto')
const dur = document.getElementById('duracao')
const erro = document.getElementById('erro')
const lista = document.getElementById('atividades')
const listav = document.getElementById('lista-vazia')
const total = document.getElementById('total')

let tminutos = 0

function atualizarRelogio() {
    const agora = new Date()
    const hora = agora.getHours()
    const horario = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    rel.textContent = horario
    rel.setAttribute('datetime', horario)

    if (hora < 12) {
        periodo.textContent = 'Manhã'
        document.body.dataset.periodo = 'manha'
    } else if (hora < 18) {
        periodo.textContent = 'Tarde'
        document.body.dataset.periodo = 'tarde'
    } else {
        periodo.textContent = 'Noite'
        document.body.dataset.periodo = 'noite'
    }
}

function mostrarErro(campo, mensagem) {
    erro.hidden = false
    erro.textContent = mensagem
    campo.setAttribute('aria-invalid', 'true')
    campo.setAttribute('aria-describedby', 'erro')
    campo.focus()
}

function limparErro() {
    const campo = form.querySelector('[aria-invalid]')
    if (!campo) return

    campo.removeAttribute('aria-invalid')
    campo.removeAttribute('aria-describedby')
    erro.textContent = ''
    erro.hidden = true
}

function atualizarResumo() {
    total.textContent = `${tminutos} min no total`
    listav.hidden = lista.children.length > 0
}

function adicionarAtividade(evento) {
    evento.preventDefault()
    limparErro()

    const nome = assunto.value.trim()
    const minutos = dur.valueAsNumber
    const tipo = form.querySelector('input[name="tipo"]:checked').value

    if (nome === '') {
        mostrarErro(assunto, 'Digite o assunto da atividade.')
        return
    }

    if (!Number.isInteger(minutos) || minutos < 1 || minutos > 720) {
        mostrarErro(dur, 'Digite um número inteiro entre 1 e 720 minutos.')
        return
    }

    const item = document.createElement('li')
    const detalhes = document.createElement('div')
    const titulo = document.createElement('strong')
    const descricao = document.createElement('p')
    const botao = document.createElement('button')

    titulo.textContent = nome
    descricao.textContent = `${tipo} · ${minutos} min`
    detalhes.className = 'atividade'
    detalhes.append(titulo, descricao)

    botao.type = 'button'
    botao.className = 'remover'
    botao.textContent = 'Remover'
    botao.setAttribute('aria-label', `Remover ${nome}`)
    botao.addEventListener('click', function () {
        const vizinho = item.nextElementSibling || item.previousElementSibling
        const destino = vizinho ? vizinho.querySelector('button') : assunto

        item.remove()
        tminutos -= minutos
        atualizarResumo()
        destino.focus()
    })

    item.append(detalhes, botao)
    lista.appendChild(item)
    tminutos += minutos
    atualizarResumo()
    form.reset()
    assunto.focus()
}

form.addEventListener('input', function (evento) {
    if (evento.target.matches('[aria-invalid]')) limparErro()
})
form.addEventListener('submit', adicionarAtividade)
atualizarRelogio()
setInterval(atualizarRelogio, 1000)
