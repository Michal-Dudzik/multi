  ////////////////////////DziaΕa ok, ale jest skomplikowane i nie wpada Εadnie w dropzone////////////////////////////////////
  // const tile = document.getElementsByClassName("draggable");

  //   for (let i = 0; i < tile.length; i++) {
  //     tile[i].style.position = "relative";
  //   }

  //   function filter(e) {
  //     let target = e.target;

  //     if (!target.classList.contains("draggable")) {
  //       return;
  //     }

  //     target.moving = true;

  //     //NOTICE THIS π Check if Mouse events exist on users' device
  //     if (e.clientX) {
  //       target.oldX = e.clientX; // If they exist then use Mouse input
  //       target.oldY = e.clientY;
  //     } else {
  //       target.oldX = e.touches[0].clientX; // Otherwise use touch input
  //       target.oldY = e.touches[0].clientY;
  //     }
  //     //NOTICE THIS π Since there can be multiple touches, you need to mention which touch to look for, we are using the first touch only in this case

  //     target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
  //     target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

  //     document.onmousemove = dr;
  //     //NOTICE THIS π
  //     document.ontouchmove = dr;
  //     //NOTICE THIS π

  //     function dr(event) {
  //       event.preventDefault();

  //       if (!target.moving) {
  //         return;
  //       }
  //       //NOTICE THIS π
  //       if (event.clientX) {
  //         target.distX = event.clientX - target.oldX;
  //         target.distY = event.clientY - target.oldY;
  //       } else {
  //         target.distX = event.touches[0].clientX - target.oldX;
  //         target.distY = event.touches[0].clientY - target.oldY;
  //       }
  //       //NOTICE THIS π

  //       target.style.left = target.oldLeft + target.distX + "px";
  //       target.style.top = target.oldTop + target.distY + "px";
  //     }

  //     function endDrag() {
  //       target.moving = false;
  //     }
  //     target.onmouseup = endDrag;
  //     //NOTICE THIS π
  //     target.ontouchend = endDrag;
  //     //NOTICE THIS π
  //   }
  //   document.onmousedown = filter;
  //   //NOTICE THIS π
  //   document.ontouchstart = filter;
  //   //NOTICE THIS π



////////////////////Jest mniej skomplikowane, ale siΔ sypie, prΓ³bujΔ ΕadowaΔ pliki nie wiadomo skΔd, do poprawy////////////////////////////////

/* draggable element */
const item = document.querySelector('.tile');

item.addEventListener('dragstart', dragStart);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}


/* drop targets */
const boxes = document.querySelectorAll('.dropzone');

boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // add it to the drop target
    e.target.appendChild(draggable);

    // display the draggable element
    draggable.classList.remove('hide');
}