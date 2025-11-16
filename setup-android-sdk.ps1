# PowerShell script to help set up Android SDK environment variables
# Run this script as Administrator

Write-Host "Android SDK Setup Script" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

# Common SDK locations to check
$possiblePaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "C:\Android\Sdk",
    "${env:ProgramFiles}\Android\Sdk",
    "${env:ProgramFiles(x86)}\Android\Sdk"
)

$sdkPath = $null

# Check each possible location
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $sdkPath = $path
        Write-Host "Found Android SDK at: $sdkPath" -ForegroundColor Green
        break
    }
}

if (-not $sdkPath) {
    Write-Host "Android SDK not found in common locations." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Android Studio first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host "2. Install and open Android Studio" -ForegroundColor Cyan
    Write-Host "3. Complete the setup wizard" -ForegroundColor Cyan
    Write-Host "4. Go to Tools → SDK Manager and install:" -ForegroundColor Cyan
    Write-Host "   - Android SDK Platform (latest)" -ForegroundColor Cyan
    Write-Host "   - Android SDK Build-Tools" -ForegroundColor Cyan
    Write-Host "   - Android SDK Command-line Tools" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again, or manually enter your SDK path below." -ForegroundColor Yellow
    Write-Host ""
    $manualPath = Read-Host "Enter your Android SDK path (or press Enter to skip)"
    if ($manualPath -and (Test-Path $manualPath)) {
        $sdkPath = $manualPath
    }
}

if ($sdkPath) {
    Write-Host ""
    Write-Host "Setting up environment variables..." -ForegroundColor Green
    
    # Set ANDROID_HOME
    [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdkPath, 'User')
    Write-Host "✓ Set ANDROID_HOME to: $sdkPath" -ForegroundColor Green
    
    # Add to PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
    $platformTools = "$sdkPath\platform-tools"
    $tools = "$sdkPath\tools"
    $cmdlineTools = "$sdkPath\cmdline-tools\latest\bin"
    
    $pathsToAdd = @($platformTools, $tools, $cmdlineTools)
    $newPath = $currentPath
    
    foreach ($pathToAdd in $pathsToAdd) {
        if (Test-Path $pathToAdd) {
            if ($newPath -notlike "*$pathToAdd*") {
                $newPath = "$newPath;$pathToAdd"
                Write-Host "✓ Added to PATH: $pathToAdd" -ForegroundColor Green
            }
        }
    }
    
    [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    
    Write-Host ""
    Write-Host "Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Please close and reopen your terminal/PowerShell window" -ForegroundColor Yellow
    Write-Host "for the changes to take effect." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After restarting, verify with:" -ForegroundColor Cyan
    Write-Host "  echo `$env:ANDROID_HOME" -ForegroundColor White
    Write-Host "  adb version" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Setup incomplete. Please install Android Studio first." -ForegroundColor Red
}

