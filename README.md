# christmas

Customizable plugin to display snow on a page. Uses jQuery and a html5 canvas.

## Installation

```
<script src="christmas.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
  jQuery.gcChristmas();
});
</script>
```

## Configuration



## Examples

### Basic snow

```
jQuery.gcChristmas({
  snowColor: '#ebebeb',
  maxParticles: 20,
  clickIncrement: 5,
  maxFlakesSize: 10,
  refreshInterval: 40,
  maxDensity: 40,
  snowMode: 'flakes',
  flakesSegments: 6,
  smallSegmentsLength: 0.4,
  smallSegmentsStart: 0.6,
  smallSegmentsAngle: 30
});
```

### Images

```
jQuery.gcChristmas({
  snowMode: 'images',
  maxParticles: 5,
  clickIncrement: 2,
  images: [{
    width: 173,
    height: 216,
    ratio: 17,
    src: 'img/sb.png'
  },{
    width: 430,
    height: 530,
    ratio: 43,
    src: 'img/sb2.png'
  },{
    width: 232,
    height: 254,
    ratio: 23,
    src: 'img/sb3.png'
  }]
});
```


### Not really snow

```
jQuery.gcChristmas({
  snowMode: 'custom',
  maxFlakesSize: 30,
  customDrawParticle: function(christmas, ctx, p) {
    ctx.fillStyle = '#ffd6ba';
    ctx.beginPath();
    var ballsGap = 0.7;
    var shaftWidth = 0.6;
    var shaftLength = 4;
    var slitLength = 0.3;
    var slitWidth = 0.1;
    var x1 = p.x - ballsGap * p.r;
    var x2 = p.x + ballsGap * p.r;
    ctx.moveTo(x1, p.y);
    ctx.arc(x1, p.y, p.r, 0, Math.PI * 2, true);
    ctx.moveTo(x2, p.y);
    ctx.arc(x2, p.y, p.r, 0, Math.PI * 2, true);
    ctx.moveTo(p.x - shaftWidth * p.r, p.y);
    ctx.fillRect(p.x - shaftWidth * p.r, p.y, 2 * shaftWidth * p.r, shaftLength * p.r);
    ctx.moveTo(p.x, p.y + shaftLength * p.r);
    ctx.arc(p.x, p.y + shaftLength * p.r, shaftWidth * p.r, 0, Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = slitWidth * p.r;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.moveTo(p.x, p.y + (shaftLength + shaftWidth) * p.r);
    ctx.lineTo(p.x, p.y + (shaftLength + shaftWidth - slitLength) * p.r);
    ctx.stroke()
  }
});
```
