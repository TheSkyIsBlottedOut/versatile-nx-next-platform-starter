#- vpcs getcfg <path>  Get content from yaml file
$YamlPath = $env:PalmNxApp.Path.Root + "\vpcs.yml"
$Yaml = Get-Content $YamlPath -Raw
$YamlContent = $Yaml | ConvertFrom-Yaml
# Are there args?
if ($args.Count -eq 0) {
  Write-Host "Usage: vpcs getcfg <path>"
  return
} else {
  for ($i = 0; $i -lt $args.Count; $i++) {
    $args[$i] = $args[$i].Replace(".", ":")
  }
  $Path = $args -join "."
  $Value = $YamlContent.$Path
  if ($Value -eq $null) {
    Write-Host "Error: Could not find value at path '$Path'."
    return
  }
  # Return value for use by other scripts
  return $Value
}
