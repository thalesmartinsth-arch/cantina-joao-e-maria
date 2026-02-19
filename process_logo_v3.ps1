Add-Type -AssemblyName System.Drawing

$source = "C:\Users\thales.martins\.gemini\antigravity\brain\3d8b20e4-4856-455f-b0e6-f74605b0f17f\media__1771179565350.png"
$dest = "c:\Users\thales.martins\Documents\Antigravity\Lanchonete\src\assets\logo.png"

Write-Host "Starting Logo Processing V3 (Edge Cleaning)..."

try {
    # 1. Load Original
    $img = [System.Drawing.Bitmap]::FromFile($source)
    
    # 2. Crop 15px from all edges to remove artifacts/borders
    $edgeCrop = 15
    $safeWidth = $img.Width - ($edgeCrop * 2)
    $safeHeight = $img.Height - ($edgeCrop * 2)
    
    if ($safeWidth -le 0 -or $safeHeight -le 0) {
        Write-Error "Image too small for edge cropping"
        exit 1
    }

    $safeRect = New-Object System.Drawing.Rectangle($edgeCrop, $edgeCrop, $safeWidth, $safeHeight)
    $safeBmp = New-Object System.Drawing.Bitmap($safeWidth, $safeHeight)
    $gSafe = [System.Drawing.Graphics]::FromImage($safeBmp)
    $gSafe.DrawImage($img, 0, 0, $safeRect, [System.Drawing.GraphicsUnit]::Pixel)
    $gSafe.Dispose()
    $img.Dispose()

    # 3. Remove Background (White -> Transparent)
    $tolerance = 30 # Increased tolerance
    $minY = $safeBmp.Height
    $maxY = 0
    $minX = $safeBmp.Width
    $maxX = 0
    $hasContent = $false

    for ($x = 0; $x -lt $safeBmp.Width; $x++) {
        for ($y = 0; $y -lt $safeBmp.Height; $y++) {
            $pixel = $safeBmp.GetPixel($x, $y)
            
            # Check if pixel is white-ish
            if ($pixel.R -gt (255 - $tolerance) -and $pixel.G -gt (255 - $tolerance) -and $pixel.B -gt (255 - $tolerance)) {
                $safeBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
            else {
                # Update bounds for final crop
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
                $hasContent = $true
            }
        }
    }

    if (-not $hasContent) {
        Write-Error "Image became fully transparent after processing!"
        exit 1
    }

    # 4. Final Auto-Crop (Tight fit)
    $width = $maxX - $minX + 1
    $height = $maxY - $minY + 1
    
    # Small padding for aesthetics
    $padding = 2
    $finalWidth = $width + ($padding * 2)
    $finalHeight = $height + ($padding * 2)
    
    $finalBmp = New-Object System.Drawing.Bitmap($finalWidth, $finalHeight)
    $gFinal = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    # Clear background
    $gFinal.Clear([System.Drawing.Color]::Transparent)

    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $width, $height)
    $destRect = New-Object System.Drawing.Rectangle($padding, $padding, $width, $height)
    
    $gFinal.DrawImage($safeBmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $finalBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $gFinal.Dispose()
    $finalBmp.Dispose()
    $safeBmp.Dispose()
    
    Write-Host "Success: Logo V3 saved to $dest"
    Write-Host "Edges clipped and background removed."

}
catch {
    Write-Error "Error: $_"
    exit 1
}
