document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const button = document.getElementsByTagName('button')[0];
    
	function formatNumber(number) {
		return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    button.addEventListener('click', event => {
        const sound = new Audio("../audio/tuturu.mp3");
        sound.play();
        socket.emit('click');
    }); 

    renderCounter = updatedCounter => {
        document.getElementById('counter').innerText = formatNumber(updatedCounter);
    };

    socket.on('realValue', updatedCounter => {
        renderCounter(updatedCounter);
    });
});