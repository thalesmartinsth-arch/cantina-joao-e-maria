Add-Type -AssemblyName System.Drawing

$source = "C:\Users\thales.martins\.gemini\antigravity\brain\3d8b20e4-4856-455f-b0e6-f74605b0f17f\media__1771179565350.png"
$dest = "c:\Users\thales.martins\Documents\Antigravity\Lanchonete\src\assets\logo.png"

Write-Host "Processing image..."

try {
    $img = [System.Drawing.Bitmap]::FromFile($source)
    
    # Create a new bitmap to avoid file lock issues and enable editing
    $newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
    $g.Dispose()
    $img.Dispose() # Release the source file

    for ($x=0; $x -lt $newImg.Width; $x++) {
        for ($y=0; $y -lt $newImg.Height; $y++) {
            $pixel = $newImg.GetPixel($x, $y)
            if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
                $newImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }

    $newImg.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImg.Dispose()
    Write-Host "Success: Logo saved to $dest"
} catch {
    Write-Error "Failed to process image: $_"
    exit 1
}
