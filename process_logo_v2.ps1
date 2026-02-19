Add-Type -AssemblyName System.Drawing

$source = "C:\Users\thales.martins\.gemini\antigravity\brain\3d8b20e4-4856-455f-b0e6-f74605b0f17f\media__1771179565350.png"
$dest = "c:\Users\thales.martins\Documents\Antigravity\Lanchonete\src\assets\logo.png"

Write-Host "Starting Advanced Image Processing..."

try {
    $img = [System.Drawing.Bitmap]::FromFile($source)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
    $g.Dispose()
    $img.Dispose()

    # 1. Remove Background with Tolerance
    $tolerance = 20 # 0-255 range, approx 10%
    $minY = $bmp.Height
    $maxY = 0
    $minX = $bmp.Width
    $maxX = 0
    $hasContent = $false

    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            $pixel = $bmp.GetPixel($x, $y)
            
            # Check if pixel is "white-ish"
            if ($pixel.R -gt (255 - $tolerance) -and $pixel.G -gt (255 - $tolerance) -and $pixel.B -gt (255 - $tolerance)) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
            else {
                # Update bounds for cropping
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
                $hasContent = $true
            }
        }
    }

    if (-not $hasContent) {
        Write-Error "Image became fully transparent!"
        exit 1
    }

    # 2. Crop Image
    $width = $maxX - $minX + 1
    $height = $maxY - $minY + 1
    
    # Add a small padding
    $padding = 5
    $finalWidth = $width + ($padding * 2)
    $finalHeight = $height + ($padding * 2)
    
    $finalBmp = New-Object System.Drawing.Bitmap($finalWidth, $finalHeight)
    $gFinal = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $width, $height)
    $destRect = New-Object System.Drawing.Rectangle($padding, $padding, $width, $height)
    
    $gFinal.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $finalBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $gFinal.Dispose()
    $finalBmp.Dispose()
    $bmp.Dispose()
    
    Write-Host "Success: Processed and Cropped Logo saved to $dest"
    Write-Host "New Dimensions: $finalWidth x $finalHeight"

}
catch {
    Write-Error "Error: $_"
    exit 1
}
