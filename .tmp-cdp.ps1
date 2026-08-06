param(
  [Parameter(Mandatory = $true)][string]$WebSocketUrl,
  [Parameter(Mandatory = $true)][string]$Expression
)

$socket = [System.Net.WebSockets.ClientWebSocket]::new()
$token = [Threading.CancellationToken]::None
[void]$socket.ConnectAsync([Uri]$WebSocketUrl, $token).GetAwaiter().GetResult()

$payload = @{
  id = 1
  method = "Runtime.evaluate"
  params = @{
    expression = $Expression
    awaitPromise = $true
    returnByValue = $true
  }
} | ConvertTo-Json -Depth 5 -Compress

$bytes = [Text.Encoding]::UTF8.GetBytes($payload)
[void]$socket.SendAsync(
  [ArraySegment[byte]]::new($bytes),
  [System.Net.WebSockets.WebSocketMessageType]::Text,
  $true,
  $token
).GetAwaiter().GetResult()

do {
  $buffer = New-Object byte[] 65536
  $message = [Text.StringBuilder]::new()
  do {
    $received = $socket.ReceiveAsync([ArraySegment[byte]]::new($buffer), $token).GetAwaiter().GetResult()
    [void]$message.Append([Text.Encoding]::UTF8.GetString($buffer, 0, $received.Count))
  } until ($received.EndOfMessage)
  $response = $message.ToString() | ConvertFrom-Json
} until ($response.id -eq 1)

[void]$socket.CloseAsync(
  [System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,
  "done",
  $token
).GetAwaiter().GetResult()

$response.result.result.value | ConvertTo-Json -Depth 10
