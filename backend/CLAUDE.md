# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este é o backend do monorepo `cuidamais` (irmão de `../mobile/`, que tem seu próprio `CLAUDE.md`).

## Stack

- C# / .NET 9 (SDK `9.0.3xx`)
- ASP.NET Core Web API com Controllers (sem Minimal APIs)
- Entity Framework Core 9 + SQL Server (LocalDB em dev, instância `MSSQLLocalDB`)
- xUnit para testes

## Setup em uma máquina nova

1. Instalar o SDK .NET 9 (`dotnet --list-sdks` deve listar `9.0.3xx` ou superior).
2. Ter uma instância SQL Server acessível — em dev, o LocalDB (`MSSQLLocalDB`) já vem com o Visual Studio Community, não precisa instalar nada.
3. Configurar a connection string via User Secrets (nunca commitar em `appsettings.json`):
   ```
   dotnet user-secrets set "ConnectionStrings:CuidaMais" "Server=(localdb)\MSSQLLocalDB;Database=CuidaMais;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True" --project src/CuidaMais.Api
   ```
4. Instalar/atualizar a ferramenta `dotnet-ef` (precisa estar na mesma major version do pacote `Microsoft.EntityFrameworkCore.Design` usado no projeto — hoje EF Core 9):
   ```
   dotnet tool update -g dotnet-ef
   ```
5. Criar o banco aplicando as migrations (ver comando abaixo).

## Comandos

Rodar a partir da raiz do repositório (onde fica `CuidaMais.slnx`):

- `dotnet build` — build de toda a solution
- `dotnet run --project src/CuidaMais.Api` — sobe a API (`GET /health` valida se a API e o banco estão de pé)
- `dotnet test` — roda todos os testes (`tests/CuidaMais.Application.Tests`)
- `dotnet test --filter "FullyQualifiedName~NomeDaClasseOuMetodo"` — roda um teste/classe específico
- `dotnet ef migrations add <Nome> --project src/CuidaMais.Infrastructure --startup-project src/CuidaMais.Api` — nova migration
- `dotnet ef database update --project src/CuidaMais.Infrastructure --startup-project src/CuidaMais.Api` — aplica migrations pendentes (cria o banco se não existir)

## Arquitetura — Controller → AppService → Repository

```
src/
├── CuidaMais.Domain/          entidades puras, sem dependências externas
├── CuidaMais.Application/     *AppService (regra de negócio/orquestração), interfaces I*Repository, DTOs — não conhece EF Core/SQL Server
├── CuidaMais.Infrastructure/  CuidaMaisDbContext, migrations, *Repository (implementam as interfaces do Application)
└── CuidaMais.Api/             Controllers, Program.cs (composition root: liga I*Repository → *Repository via DI), appsettings
tests/
└── CuidaMais.Application.Tests/  testes dos AppServices com Repository mockado
```

Regra fixa: **Controller só chama AppService. AppService só chama Repository (via interface). Nunca pular camada** (ex.: Controller acessando Repository ou DbContext direto).

Exemplo de referência do padrão: `HealthController` → `HealthCheckAppService` → `IHealthCheckRepository`/`HealthCheckRepository` (`src/CuidaMais.Api/Controllers/HealthController.cs`, `src/CuidaMais.Application/Services/HealthCheckAppService.cs`, `src/CuidaMais.Infrastructure/Repositories/HealthCheckRepository.cs`).

## Connection string

Não é commitada. Fica em **User Secrets** do projeto `CuidaMais.Api` (`dotnet user-secrets list --project src/CuidaMais.Api`), chave `ConnectionStrings:CuidaMais`. Em dev, aponta para o LocalDB (`(localdb)\MSSQLLocalDB`, banco `CuidaMais`) instalado junto com o Visual Studio Community.

## Visualizar o banco de dados

No Visual Studio: **Exibir → Pesquisador de Objetos do SQL Server** (`Ctrl+], Ctrl+S`) → conectar em `(localdb)\MSSQLLocalDB` com Windows Authentication → **Bancos de Dados → CuidaMais → Tabelas**.

Alternativa via linha de comando:
```
sqlcmd -S "(localdb)\MSSQLLocalDB" -d CuidaMais -Q "SELECT * FROM __EFMigrationsHistory"
```

## Memória do projeto

Contexto e histórico de atividades ficam em:
`..\..\Memory\cuidamais.memory`

Diretrizes gerais de execução (idioma, escolha de modelo, registro de atividades) ficam em:
`..\..\Memory\diretrizes.md`
