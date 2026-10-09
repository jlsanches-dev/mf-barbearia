# Servidor local para ver o site no navegador: http://localhost:8080
# Uso: clique com o botão direito > "Executar com o PowerShell"  (Ctrl+C para parar)
param([int]$Porta = 8080)
$raiz = $PSScriptRoot
$tipos = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".webp"="image/webp"; ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".json"="application/json" }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Porta/")
$l.Start()
Write-Host "Site rodando em http://localhost:$Porta  (Ctrl+C para parar)"
while ($l.IsListening) {
  $c = $l.GetContext()
  $caminho = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  if ($caminho -eq '') { $caminho = 'index.html' }
  $arq = [IO.Path]::GetFullPath((Join-Path $raiz $caminho))
  if ($arq.StartsWith($raiz) -and (Test-Path $arq -PathType Leaf)) {
    $ext = [IO.Path]::GetExtension($arq).ToLower()
    $c.Response.ContentType = $(if ($tipos[$ext]) { $tipos[$ext] } else { "application/octet-stream" })
    $c.Response.Headers.Add("Cache-Control", "no-store")
    $b = [IO.File]::ReadAllBytes($arq)
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
