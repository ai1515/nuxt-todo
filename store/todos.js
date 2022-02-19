import firebase from "~/plugins/firebase";
import { firestoreAction } from "vuexfire";

const db = firebase.firestore();
// コレクションはtodosを使う、という設定
const todosRef = db.collection("todos");

// stateを定義、todo一覧を管理するtodosを配列で定義
export const state = () => ({
  todos: []
});

export const actions = {
  // init:初期化
  // vuexfireが用意しているactionであるfirestoreActionを使う
  // 第一引数にはcontextが入るが、bindFirestoreRefと書くと、bindFirestoreRefのみ受け取ることができる
  init: firestoreAction(({ bindFirestoreRef }) => {
    //   bindしたいデータと参照場所を渡すとstate.todosにバインド(関連付け)される
    bindFirestoreRef("todos", todosRef);
  }),
  //   add:todoの追加
  // 第二引数にtodoの名前
  add: firestoreAction((context, name) => {
    //   入力値が空白ではなければ追加する、空白なら追加されない
    if (name.trim()) {
      todosRef.add({
        name: name,
        done: false,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }),
  //   remove:todoの削除
  remove: firestoreAction((context, id) => {
    todosRef.doc(id).delete();
  }),
  //   チェックボックスの処理
  toggle: firestoreAction((context, todo) => {
    todosRef.doc(todo.id).update({
      done: !todo.done
    });
  })
};

// _:ソートのプラグインlodash(nuxt.config.jsにて記載)
export const getters = {
  orderdTodos: state => {
    return _.sortBy(state.todos, "created");
  }
};
