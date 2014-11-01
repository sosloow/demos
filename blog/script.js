document.addEventListener('DOMContentLoaded', function(){
  "use strict";

  var Post = {
    find: function() {
      if(localStorage.posts)
        return JSON.parse(localStorage.posts);
      else
        return [];
    },

    save: function(newPosts) {
      localStorage.posts = JSON.stringify(newPosts);
    },

    create: function(newPost) {
      if (newPost.body.length>0 &&
          newPost.subject.length) {
        var posts = this.find();
        newPost.date = new Date();
        newPost.id = this._hashCode(newPost.date.toString());
        posts.push(newPost);
        this.save(posts);

        return true;
      } else {
        return false;
      }
    },

    delete: function(id) {
      var posts = this.find();
      for(var i=0; i<posts.length; i++)
        if(posts[i].id==id)
          posts.splice(i,1);

      this.save(posts);
    },

    _hashCode: function(str){
      var hash = 0,
          i, ch;
      if (str.length == 0) return hash;
      for (i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash;
      }
      if(hash<0) hash = hash*-1;
      hash = hash.toString();
      if(hash.length>8) hash = hash.substr(8);
      return hash;
    }
  };

  function PostTemplate(post){
    var container = document.createElement('div'),
        subCont =  document.createElement('div'),
        subject = document.createElement('div'),
        delButton = document.createElement('button'),
        date = document.createElement('div'),
        body = document.createElement('div');

    container.classList.add('post', 'panel', 'panel-default');
    subCont.classList.add('panel-body');
    subject.classList.add('post-subj', 'panel-heading', 'lead');
    delButton.classList.add('btn', 'btn-default', 'btn-xs');
    date.classList.add('post-date', 'small');
    body.classList.add('post-body');

    container.dataset.id = post.id;
    subject.textContent = post.subject;
    date.textContent = formatDate(post.date);
    delButton.textContent = 'Delete';
    body.innerHTML = marked(post.body);

    container.appendChild(subject);
    container.appendChild(subCont);
    subCont.appendChild(date);
    subCont.appendChild(body);
    subCont.appendChild(delButton);

    delButton.addEventListener('click', function(){
      var id = this.parentNode.parentNode.dataset.id;
      Post.delete(id);

      reloadPosts();
    });

    return container;
  }

  function formatDate(dateString) {
    var months = ['January', 'February', 'March',
                  'April', 'May', 'June',
                  'July', 'August', 'September',
                  'October', 'November', 'December'],
        date = new Date(dateString),
        day = date.getDate();

    if(day==1 || (day>20 && day % 10==1))
      day += 'st';
    else if (day==2 || (day>20 && day % 10==2))
      day += 'nd';
    else if (day==3 || (day>20 && day % 10==3))
      day += 'nd';
    else
      day += 'th';

    return months[date.getMonth()]+' '+day+', '+date.getFullYear();
  }

  function reloadPosts(){
    var container = document.getElementById('posts-list'),
        posts = Post.find(),
        i, card;

    container.innerHTML = '';
    for(i=posts.length-1; i >=0; i--) {
      card = new PostTemplate(posts[i]);
      container.appendChild(card);
    }
  }

  document.getElementsByName('newPost')[0]
    .addEventListener('submit', function(e){
      e.preventDefault();
      var subject = document.getElementsByName('subj')[0].value,
          body = document.getElementsByName('body')[0].value;

      if(!Post.create({subject: subject, body: body})) {
        console.log('Fill subject and body fields.');
      } else {
        this.reset();
        document.getElementsByClassName('new-post')[0]
          .classList.toggle('hidden');
        reloadPosts();
      }
    });

  document.getElementById('formToggler')
    .addEventListener('click', function(e) {
      e.preventDefault();

      var form = document.getElementsByClassName('new-post')[0];
      form.classList.toggle('hidden');
    });

  document.getElementById('searchForm')
    .addEventListener('submit', function(e){
      e.preventDefault();
    });

  reloadPosts();
});
