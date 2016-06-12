import TodoList from '../TodoList';

export let setup = function runTest() {
  let benchmark = document.getElementById('benchmark')
  let newTodo = document.getElementById('new-todo')
  let numberOfItemsToAdd = 100
  benchmark.addEventListener('click', () => {
    var start = performance.now()

    for (var i = 0; i < numberOfItemsToAdd; i++) {
      TodoList.defaultInstance.push({
        name: 'Something to do ' + i
      })
    }
    requestAnimationFrame(function(){
      var checkboxes = document.querySelectorAll('.toggle');
      for (var i = 0; i < checkboxes.length; i++)
          checkboxes[i].click();
      requestAnimationFrame(function(){
        var deleteButtons = document.querySelectorAll('.destroy');
        for (var i = 0; i < deleteButtons.length; i++)
            deleteButtons[i].click();
        console.log(performance.now() - start)
      })
    })
  })
}