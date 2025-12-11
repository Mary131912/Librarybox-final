# Script de ayuda para gestionar Docker en LibraryBox
# Uso: .\docker-helper.ps1 [comando]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🐳 LibraryBox - Docker Helper" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  start       - Iniciar todos los contenedores" -ForegroundColor Green
    Write-Host "  stop        - Detener todos los contenedores" -ForegroundColor Red
    Write-Host "  restart     - Reiniciar todos los contenedores" -ForegroundColor Magenta
    Write-Host "  logs        - Ver logs en tiempo real" -ForegroundColor Blue
    Write-Host "  status      - Ver estado de contenedores" -ForegroundColor Cyan
    Write-Host "  build       - Reconstruir imágenes" -ForegroundColor Yellow
    Write-Host "  clean       - Limpiar contenedores y volúmenes" -ForegroundColor Red
    Write-Host "  shell       - Acceder a shell del contenedor app" -ForegroundColor Magenta
    Write-Host "  setup       - Configurar variables de entorno" -ForegroundColor Green
    Write-Host "  help        - Mostrar esta ayuda" -ForegroundColor White
    Write-Host ""
}

function Start-Containers {
    Write-Host "🚀 Iniciando contenedores..." -ForegroundColor Green
    docker-compose up -d
    Write-Host "✅ Contenedores iniciados" -ForegroundColor Green
    Write-Host "📱 Accede a: http://localhost:3000/login.html" -ForegroundColor Cyan
}

function Stop-Containers {
    Write-Host "⏹️  Deteniendo contenedores..." -ForegroundColor Red
    docker-compose down
    Write-Host "✅ Contenedores detenidos" -ForegroundColor Green
}

function Restart-Containers {
    Write-Host "🔄 Reiniciando contenedores..." -ForegroundColor Magenta
    docker-compose restart
    Write-Host "✅ Contenedores reiniciados" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Blue
    docker-compose logs -f
}

function Show-Status {
    Write-Host "📊 Estado de contenedores:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "💾 Uso de recursos:" -ForegroundColor Cyan
    docker stats --no-stream
}

function Build-Images {
    Write-Host "🔨 Reconstruyendo imágenes..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "✅ Imágenes reconstruidas" -ForegroundColor Green
}

function Clean-All {
    $confirmation = Read-Host "⚠️  Esto eliminará todos los contenedores y volúmenes. ¿Continuar? (s/n)"
    if ($confirmation -eq 's' -or $confirmation -eq 'S') {
        Write-Host "🧹 Limpiando..." -ForegroundColor Red
        docker-compose down -v
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Yellow
    }
}

function Open-Shell {
    Write-Host "🐚 Abriendo shell en contenedor app..." -ForegroundColor Magenta
    docker-compose exec app sh
}

function Setup-Env {
    Write-Host "⚙️  Configurando variables de entorno..." -ForegroundColor Green
    
    if (Test-Path ".env") {
        Write-Host "⚠️  El archivo .env ya existe" -ForegroundColor Yellow
        $overwrite = Read-Host "¿Deseas sobrescribirlo? (s/n)"
        if ($overwrite -ne 's' -and $overwrite -ne 'S') {
            Write-Host "❌ Operación cancelada" -ForegroundColor Red
            return
        }
    }
    
    if (Test-Path ".env.docker.example") {
        Copy-Item ".env.docker.example" ".env"
        Write-Host "✅ Archivo .env creado desde plantilla" -ForegroundColor Green
        Write-Host "📝 Edita el archivo .env con tus credenciales de MongoDB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Variables a configurar:" -ForegroundColor Yellow
        Write-Host "  - MONGODB_URI: Tu connection string de MongoDB Atlas" -ForegroundColor White
        Write-Host "  - JWT_SECRET: Un secreto único y seguro" -ForegroundColor White
    } else {
        Write-Host "❌ No se encontró .env.docker.example" -ForegroundColor Red
    }
}

# Ejecutar comando
switch ($Command) {
    "start" { Start-Containers }
    "stop" { Stop-Containers }
    "restart" { Restart-Containers }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "build" { Build-Images }
    "clean" { Clean-All }
    "shell" { Open-Shell }
    "setup" { Setup-Env }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Comando desconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
