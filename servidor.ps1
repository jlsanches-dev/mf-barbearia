# Servidor local para ver o site no navegador: http://localhost:8080
# Uso: clique com o botão direito > "Executar com o PowerShell"  (Ctrl+C para parar)
# Só responde no próprio computador (localhost) e só entrega os tipos de arquivo do site.
param([int]$Porta = 8080)
$raiz = [IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\') + '\'
$tipos = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png"; ".webp"="image/webp"; ".svg"="image/svg+xml";
  ".ico"="image/x-icon"; ".woff2"="font/woff2"; ".txt"="text/plain; charset=utf-8"; ".xml"="application/xml; charset=utf-8" }
# pastas que nunca devem ser servidas
$bloqueadas = @('.git', '.claude', 'originais')
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Porta/")
$l.Start()
Write-Host "Site rodando em http://localhost:$Porta  (Ctrl+C para parar)"
while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $caminho = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
    if ($caminho -eq '') { $caminho = 'index.html' }
    $arq = [IO.Path]::GetFullPath((Join-Path $raiz $caminho))
    $relativo = if ($arq.StartsWith($raiz, [StringComparison]::OrdinalIgnoreCase)) { $arq.Substring($raiz.Length) } else { $null }
    $primeira = if ($relativo) { ($relativo -split '[\\/]')[0] } else { '' }
    $ext = [IO.Path]::GetExtension($arq).ToLower()
    if ($relativo -and $bloqueadas -notcontains $primeira -and $tipos.ContainsKey($ext) -and (Test-Path -LiteralPath $arq -PathType Leaf)) {
      $c.Response.ContentType = $tipos[$ext]
      $c.Response.Headers.Add("Cache-Control", "no-store")
      $c.Response.Headers.Add("X-Content-Type-Options", "nosniff")
      $b = [IO.File]::ReadAllBytes($arq)
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $c.Response.StatusCode = 404 }
  } catch { $c.Response.StatusCode = 400 }
  finally { $c.Response.Close() }
}
