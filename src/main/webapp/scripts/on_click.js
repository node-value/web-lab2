var canvas = $("#graf");
var ctx = canvas[0].getContext("2d");
resizeCtxCanvas(ctx);


function onlyOne(checkbox) {
    document.getElementsByName('r').forEach((item) => { if (item !== checkbox) item.checked = false; });
    $('input[type="checkbox"]:checked').is(":checked") ? $('.button-label').removeClass('invalid') : $('.button-label').addClass('invalid');

}

function validate() {
    return $("input[type='radio']:checked").length === 1 && document.getElementById("y-field").validity.valid && $('input[type="checkbox"]:checked').is(":checked"); 
}

function getRow(obj) {
    return '<tr class="removable">'
        + '<td>' + obj.x + '</td>'
        + '<td>' + obj.y + '</td>'
        + '<td>' + obj.r + '</td>'
        + '<td>' + obj.hit + '</td>'
        + '<td>' + obj.curtime + '</td>'
        + '<td>' + obj.exectime + '</td>';
}

function resizeCtxCanvas(ctx) {
    const { width, height } = ctx.canvas.getBoundingClientRect();
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

$('form').on('submit', function (event) {
    event.preventDefault();
    if (!validate()) return;
    $.ajax({
        url: 'http://127.0.0.1:8080/web-lab2/controller_servlet',
        dataType: "json",
        data: $('form').serialize(),
        beforeSend: () => $('.button').attr('disabled', 'disabled'),
        success: function (data) {
            $('.button').attr('disabled', false);
            $('#result-table').append(getRow(data));
        },
        statusCode: {
            400: (x) => alert(x)
        },
        error: () => alert("Something went wrong!")
    });
});

$(document).ready(function () {
    
    resizeCtxCanvas($("#graf")[0].getContext("2d"));

    $.ajax({
        url: 'http://127.0.0.1:8080/web-lab2/controller_servlet?get_table=1',
        dataType: "json",
        success: function(data) {  
            for (i = 0; i < Object.keys(data).length; i++) 
                $('#result-table').append(getRow(data[i])); 
        }
    });


});

$('input.button[type=button]').click(function () {
    $('.button-label').removeClass('invalid');
    document.getElementsByName('r').forEach(item => item.checked = item.value === '1');
    document.getElementsByName('x').forEach(item => item.checked = item.value === '0');
    $('#y-field').val('0');
    $.ajax({
        url: 'http://127.0.0.1:8080/web-lab2/controller_servlet?clear_table=1',
        success: () => $('#result-table tr.removable').remove()
    });
});


window.addEventListener('resize', e => {
    resizeCtxCanvas(ctx);
});

canvas.click((e) => {
    var x = e.offsetX
        y = e.offsetY;

    var circle = new Path2D();
    circle.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill(circle);
})
