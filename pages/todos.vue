<template>
  <div>
    <!-- {{ todos }} -->
    <ul>
      <!-- todo.idはcloudfirestoreのデータ1件1件に付与されるid -->
      <li v-for="todo in todos" :key="todo.id">
        <!-- {{ todo }} -->

        <!-- todo.createdに値がある時だけ -->
        <span v-if="todo.created">
          <!-- チェックの状況についてtodo.doneをbindすることでfirestore上のデータに基づいてチェックボックスのOnOffを表示 -->
          <input
            type="checkbox"
            v-bind:checked="todo.done"
            @change="toggle(todo)"
          />
          <span v-bind:class="{ done: todo.done }">
            {{ todo.name }} {{ todo.created.toDate() | dateFilter }}
          </span>
          <!-- 引数に該当のtodoのidを渡す -->
          <button v-on:click="remove(todo.id)">X</button>
          <!-- {{ todo.id }} -->
        </span>
      </li>
    </ul>
    <div class="form">
      <form v-on:submit.prevent="add">
        <input v-model="name" />
        <button>Add</button>
      </form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: function() {
    return {
      name: "",
      done: false
    };
  },
  //   dispatchでtodos.jsのactionsのinitを読み込んでfirebaseの初期化を行う処理
  created: function() {
    this.$store.dispatch("todos/init");
  },
  methods: {
    add() {
      this.$store.dispatch("todos/add", this.name);
      this.name = "";
    },
    // 引数でfirestoreのドキュメントidのみを受け取る、dispatchでtodos.jsのstoreのactionsを呼び出す、firestoreのドキュメントidを渡す
    remove(id) {
      this.$store.dispatch("todos/remove", id);
    },
    // 引数でfirestoreのtodoそのものを受け取る(メソッドでのdoneの反転処理のために必要)、dispatchでtodos.jsのstoreのactionsを呼び出す、firestoreのtodoを渡す
    toggle(todo) {
      this.$store.dispatch("todos/toggle", todo);
    }
  },
  computed: {
    //   todos.jsのstoreのtodos配列
    todos() {
      // return this.$store.state.todos.todos
      //   ソートされた値をgetter経由で表示する
      return this.$store.getters["todos/orderdTodos"];
    }
  },
  filters: {
    dateFilter: function(date) {
      return moment(date).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>

<style>
li > span > span.done {
  text-decoration: line-through;
}
</style>
