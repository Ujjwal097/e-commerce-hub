# Start Lumina Luxe Spring Boot Backend (Port 8080)
$java21Paths = @(
    "C:\Program Files\Java\jdk-21",
    "c:\Users\UjjwalTiwari\.antigravity-ide\extensions\redhat.java-1.56.0-win32-x64\jre\21.0.12.1-win32-x86_64"
)

foreach ($path in $java21Paths) {
    if (Test-Path $path) {
        $env:JAVA_HOME = $path
        Write-Host ">>> Using Java 21 JDK at: $path" -ForegroundColor Green
        break
    }
}

Set-Location "$PSScriptRoot"
Write-Host ">>> Starting Spring Boot Backend on http://localhost:8080..." -ForegroundColor Cyan
mvn spring-boot:run
