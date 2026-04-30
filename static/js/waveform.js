document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-waveform-player]').forEach((player) => {
    const input = player.querySelector('[data-audio-input]');
    const canvas = player.querySelector('[data-waveform-canvas]');
    const audio = player.querySelector('[data-audio-element]');
    const playButton = player.querySelector('[data-play-button]');
    const timeLabel = player.querySelector('[data-time-label]');
    const ctx = canvas.getContext('2d');
    let audioBuffer = null;
    let currentObjectUrl = null;

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawWaveform();
    }

    function formatTime(seconds) {
      if (!Number.isFinite(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function drawEmpty() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('上传音频后显示波形', 24, rect.height / 2);
    }

    function drawMarkers(width, height, duration) {
      const markers = [
        { start: 0, end: 30, label: 'Intro', color: 'rgba(168,85,247,0.22)' },
        { start: 30, end: 60, label: 'Breakdown', color: 'rgba(59,130,246,0.18)' },
        { start: 60, end: 75, label: 'Build Up', color: 'rgba(234,179,8,0.18)' },
        { start: 75, end: 105, label: 'Drop', color: 'rgba(236,72,153,0.20)' },
      ];
      markers.forEach((m) => {
        const x = (m.start / duration) * width;
        const w = Math.max(2, ((m.end - m.start) / duration) * width);
        ctx.fillStyle = m.color;
        ctx.fillRect(x, 0, w, height);
        ctx.fillStyle = '#e5e7eb';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(m.label, x + 6, 18);
      });
    }

    function drawWaveform() {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (!audioBuffer) {
        drawEmpty();
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      drawMarkers(width, height, audioBuffer.duration);
      const data = audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / width);
      const amp = height / 2;
      ctx.beginPath();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j] || 0;
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();
      if (audio.duration) {
        const playX = (audio.currentTime / audio.duration) * width;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playX, 0);
        ctx.lineTo(playX, height);
        ctx.stroke();
      }
    }

    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = URL.createObjectURL(file);
      audio.src = currentObjectUrl;
      const arrayBuffer = await file.arrayBuffer();
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      await audioContext.close();
      playButton.disabled = false;
      timeLabel.textContent = `已加载：${file.name} · ${formatTime(audioBuffer.duration)}`;
      drawWaveform();
    });

    playButton.addEventListener('click', () => {
      if (!audio.src) return;
      if (audio.paused) audio.play(); else audio.pause();
    });

    audio.addEventListener('timeupdate', () => {
      timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
      drawWaveform();
    });

    player.querySelectorAll('[data-start]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!audio.src) return;
        audio.currentTime = Number(button.dataset.start || 0);
        audio.play();
      });
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  });
});
