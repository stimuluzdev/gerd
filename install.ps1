#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$Repo = "stimuluzdev/gerd"
$RepoUrl = "https://github.com/$Repo.git"
$InstallName = "gerd"

Write-Host "📦 Installing gerd CLI..." -ForegroundColor Cyan
Write-Host ""

# Check if Deno is installed
try {
    $DenoVersion = deno --version | Select-Object -First 1
    Write-Host "✓ Deno found: $DenoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Deno is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Deno first:" -ForegroundColor Yellow
    Write-Host "  irm https://deno.land/install.ps1 | iex"
    Write-Host ""
    Write-Host "Or visit: https://deno.land/#installation"
    exit 1
}

# Create temp directory
$TempDir = Join-Path $env:TEMP "gerd-install-$(Get-Random)"
New-Item -ItemType Directory -Force -Path $TempDir | Out-Null

try {
    Write-Host "📥 Downloading gerd source..."
    
    # Try git clone first
    try {
        git clone --depth 1 $RepoUrl $TempDir 2>$null
    } catch {
        # Fallback to archive download
        Write-Host "Falling back to archive download..."
        $ArchiveUrl = "https://github.com/$Repo/archive/refs/heads/main.zip"
        $ZipPath = Join-Path $TempDir "gerd.zip"
        Invoke-WebRequest -Uri $ArchiveUrl -OutFile $ZipPath
        Expand-Archive -Path $ZipPath -DestinationPath $TempDir -Force
        
        # Move contents from nested folder
        $NestedDir = Get-ChildItem -Path $TempDir -Directory | Select-Object -First 1
        Get-ChildItem -Path $NestedDir.FullName | Move-Item -Destination $TempDir -Force
        Remove-Item -Path $NestedDir.FullName -Recurse -Force
    }
    
    Write-Host "🔧 Installing gerd..."
    Push-Location (Join-Path $TempDir "cli")
    
    # Install dependencies
    Write-Host "📦 Fetching dependencies..."
    deno cache deps.ts
    
    # Install the CLI globally
    deno install -A -f -g --name $InstallName --import-map import_map.json src/main.ts
    Pop-Location
    
    Write-Host ""
    Write-Host "✅ gerd installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Run 'gerd --help' to get started."
    
} finally {
    # Cleanup
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
