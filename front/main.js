const Login = {
    template: '#login',
    name: 'Login',
    data() {
        return {
            mode: 'login',
            email: '',
            username: '',
            password: '',
            userIMG: '',
            messageToUser: '',
            emailValid: '',
            passwordValid: '',
            usernameValid: ''
        }
    },
    computed: {
        createFields() {
            if (this.mode == 'create') {
                if (this.email != '' && this.username != '' && this.password != '' 
                && this.emailValid == true && this.usernameValid == true && this.passwordValid == true) return true;
                else return false;
            } else {
                if (this.username != '' && this.password != '' && this.usernameValid == true && this.passwordValid == true) return true;
                else return false;
            }
        }
    },
    watch: {
        email(value) {
            this.email = value;
            this.validateEmail(value);
        },
        username(value) {
            this.username = value;
            this.validateUsername(value);
        },
        password(value) {
            this.password = value;
            this.validatePassword(value);
        }
    },
    methods: {
        switchToCreateAccount() {
            this.mode = 'create'
            this.messageToUser = '';
        },
        switchToLogin() {
            this.mode = 'login';
            this.messageToUser = '';
        },
        validateEmail(value) {
            const emailField = document.querySelector('#email')
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                emailField.style.border = 'medium solid rgb(76, 187, 23)';
                this.messageToUser = ''
                this.emailValid = true
            } else {
                emailField.style.border = 'medium solid rgb(253, 45, 1)';
                this.messageToUser = 'Email non valide'
                this.emailValid = false
            }
        },
        validateUsername(value) {
            const usernameField = document.querySelector('#username')
            if (/^\w{3,20}$/.test(value)) {
                usernameField.style.border = 'medium solid rgb(76, 187, 23)';
                this.messageToUser = ''
                this.usernameValid = true
            } else {
                usernameField.style.border = 'medium solid rgb(253, 45, 1)';
                this.messageToUser = 'Pseudo doit contenir entre 3 et 20 caractères de lettres et/ou chiffres'
                this.usernameValid = false
            }
        },
        validatePassword(value) {
            const passwordField = document.querySelector('#password')
            if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(value)) {
                passwordField.style.border = 'medium solid rgb(76, 187, 23)';
                this.messageToUser = ''
                this.passwordValid = true
            } else {
                passwordField.style.border = 'medium solid rgb(253, 45, 1)';
                this.messageToUser = 'Mot de passe doit contenir entre 7 et 15 caractères, avec au moins un chiffre et un caractère spécial'
                this.passwordValid = false
            }
        },
        loginAccount() {
            if (this.createFields == false) alert('Veuillez remplir correctement tous les champs')
            else {
                axios.post('http://localhost:3000/api/users/login', {
                    username: this.username,
                    password: this.password
                })
                .then(user => {
                    const token = user.data.token; 
                    const userId = user.data.userId;
                    const username = user.data.username;
                    const userRole = user.data.userRole;
                    sessionStorage.setItem('token', JSON.stringify(token))
                    sessionStorage.setItem('userId', JSON.stringify(userId))
                    sessionStorage.setItem('username', JSON.stringify(username))
                    sessionStorage.setItem('userRole', JSON.stringify(userRole))
                    if (token) router.push({ path: `/${username}` })
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.messageToUser = 'Mot de passe incorrect'
                    } else if (err.response.status == 404) {
                        this.messageToUser = 'Utilisateur inconnu'
                    }
                })
            }
        },
        createAccount() {
            if (this.createFields == false) alert('Veuillez remplir correctement tous les champs')
            else {
                axios.post('http://localhost:3000/api/users/signup', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
                .then(() => this.messageToUser = 'Votre compte est créé')
                .catch(err => this.messageToUser = err.response.data.err.errors[0].path + ' déja pris')
            }
        }
    }
}

const Forum = { 
    template: '#forum',
    name: 'Forum',
    data() {
        return {
            showWriteMessage: false,
            writePost: '',
            messageToUser: '',
            posts: [{
                username: '',
                updatedAt: '',
                content: '',
                id:'',
                userIMG: ''
            }]
        }
    },
    created() {
        this.getPost()
    },
    computed: {
        enablePost() {
            if (this.writePost != '') return true;
            else return false
        }
    },
    methods: {
        logout() {
            sessionStorage.clear();
            router.push({ path: '/'})
        },
        getPost() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            axios.get('http://localhost:3000/api/posts', postConfig)
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    this.posts[i] = res.data[i];
                    this.posts[i].updatedAt = res.data[i].updatedAt.split('T')[0];
                }
            }).catch(err => console.log(err))
        },
        previewFile() {
            const preview = document.querySelector('.post_writing_fields img');
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const reader = new FileReader();
            this.messageToUser = '';
            reader.addEventListener('load', () => {
                preview.classList.remove('hidden')
                preview.src = reader.result;
            }, false);
            if (file) reader.readAsDataURL(file);
            if (file.size > 2500000) return this.messageToUser = 'Taille maximale acceptée : 2.5MB'
        },
        createPost() {
            if (this.enablePost == false) return alert('Veuillez écrire un message')
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (!file) {
                const postData = { username: username, content: this.writePost };
                axios.post('http://localhost:3000/api/posts', postData, postConfig)
                .then(res => {
                    console.log(res.data)
                    this.getPost()
                }).catch(err => console.log(err))
                this.writePost = '';
                this.showWriteMessage = false
            } else {
                if (file.size > 2500000) return this.messageToUser = 'Taille maximale acceptée : 2.5MB'
                let formData = new FormData();
                formData.append('image', file);
                formData.append('username', username);
                formData.append('content', this.writePost);
                axios.post('http://localhost:3000/api/posts', formData, postConfig)
                .then(res => {
                    console.log(res.data)
                }).catch(err => console.log(err))
                this.writePost = '';
                this.showWriteMessage = false
                this.getPost()
            }
        },
        goToProfile() {
            const username = JSON.parse(sessionStorage.getItem('username'))
            router.push({ path: `/${username}` })
        }
    }
}

const Post = { 
    template: '#post',
    name: 'Post',
    data() {
        return {
            role: '', //postAuthor
            showWriteMessage: false,
            showEditPost: false,
            status: '', //V-IF EDIT COMMENT BLOCK
            mode: '', //toEdit
            writePost: '',
            writeComment: '',
            editComment: '',
            iconLike: '',
            iconDislike: '',
            totalLikes: '',
            totalDislikes: '',
            totalComments: '',
            messageToUser: '',
            post: [{
                username: '',
                userIMG: '',
                updatedAt: '',
                content: '',
                userId: '',
                id:'',
                like: '',
                dislike: ''
            }],
            comments: [{
                content: '',
                id: '',
                username: '',
                userIMG: '',
                updatedAt: ''
            }]
        }
    },
    created() {
        this.getPosts()
        this.getRating()
        this.getComments()
        this.getLikes()
        this.getDislikes()
        },
    computed: {
        enableLike() {
            if (this.post.like == 1) return true;
            else return false
        },
        enableDislike() {
            if (this.post.dislike == 1) return true;
            else return false
        },
        enablePost() {
            if (this.writePost != '') return true;
            else return false
        },
        enableComment() {
            if (this.writeComment != '') return true;
            else return false
        }
    },
    methods: {
        getPosts() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const userRole = JSON.parse(sessionStorage.getItem('userRole'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const index = this.$route.params.id
            if (userRole == 'admin') this.role = 'superUser';
            axios.get(`http://localhost:3000/api/posts/${index}`, postConfig)
            .then(res => {
                this.post = res.data;
                this.post.updatedAt = res.data.updatedAt.split('T')[0];
                if (res.data.userId == userId) this.role = 'postAuthor';
            })
            .catch(err => console.log(err))
        },
        getComments() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const userRole = JSON.parse(sessionStorage.getItem('userRole'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const index = this.$route.params.id
            
            axios.get(`http://localhost:3000/api/posts/${index}/comment`, postConfig)
            .then(res => {
                if (res.data.length == '') return this.totalComments = 0
                else { 
                    this.totalComments = res.data.length
                    for (let i = 0; i < res.data.length; i++) {
                        this.comments[i] = res.data[i];
                        this.comments[i].updatedAt = res.data[i].updatedAt.split('T')[0];
                        if (res.data[i].username == username) this.comments[i].role = 'commentAuthor';
                        if (userRole == 'admin') this.comments[i].role = 'superUser'
                    }
                }
            }).catch(err => console.log(err))
        },
        getRating() {
            const token = JSON.parse(sessionStorage.getItem('token'));
            const postId = this.$route.params.id;
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }};
            axios.get(`http://localhost:3000/api/ratings/${postId}`, postConfig)
            .then(res => {
                this.post.like = res.data.like
                this.post.dislike = res.data.dislike
                this.enableLike
                this.enableDislike
            }).catch(err => console.log(err))
        },
        getLikes() {
            const token = JSON.parse(sessionStorage.getItem('token'));
            const postId = this.$route.params.id;
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }};
            axios.get(`http://localhost:3000/api/ratings/like/${postId}`, postConfig)
            .then(res => {
                if (res.data.length == '') this.totalLikes = 0
                else this.totalLikes = res.data.length
            }).catch(err => console.log(err))
        },
        getDislikes() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const postId = this.$route.params.id
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            axios.get(`http://localhost:3000/api/ratings/dislike/${postId}`, postConfig)
            .then(res => {
                if (res.data.length == '') this.totalDislikes = 0
                else this.totalDislikes = res.data.length
            }).catch(err => console.log(err))
        },
        likePost() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const postId = this.$route.params.id;
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (this.post.like == 0) {
                const postData = { 
                    postId: postId,
                    userId: userId,
                    likes: 1,
                    dislikes: 0 };
                axios.post('http://localhost:3000/api/ratings/like', postData, postConfig)
                .then(res => {
                    console.log(res.data.message)
                    this.getLikes()
                    this.getRating()
                }).catch(err => console.log(err))
            } else if (this.post.like == 1) {
                axios.delete(`http://localhost:3000/api/ratings/like/${postId}`, postConfig)
                .then(res => {
                    console.log(res.data.message)
                    this.getLikes()
                    this.getRating()
                }).catch(err => console.log(err))
            }
        },
        dislikePost() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const postId = this.$route.params.id;
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (this.post.dislike == 0) {
                const postData = { 
                    postId: postId,
                    userId: userId,
                    likes: 0,
                    dislikes: 1 };
                axios.post('http://localhost:3000/api/ratings/dislike', postData, postConfig)
                .then(res => {
                    console.log(res.data.message)
                    this.getDislikes()
                    this.getRating()
                }).catch(err => console.log(err))
            } else if (this.post.dislike == 1) {
                axios.delete(`http://localhost:3000/api/ratings/dislike/${postId}`, postConfig)
                .then(res => {
                    console.log(res.data.message)
                    this.getDislikes()
                    this.getRating()
                }).catch(err => console.log(err))
            }
        },
        previewFile() {
            const preview = document.querySelector('.post_writing_fields img');
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const reader = new FileReader();
            this.messageToUser = '';
            reader.addEventListener('load', () => {
                preview.classList.remove('hidden')
                preview.src = reader.result;
            }, false);
            if (file) reader.readAsDataURL(file);
            if (file.size > 2500000) return this.messageToUser = 'Taille maximale acceptée : 2.5MB';
        },
        createPost() {
            if (this.enablePost == false) return alert('Veuillez écrire un message')
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (!file) {
                const postData = { username: username, content: this.writePost };
                axios.post('http://localhost:3000/api/posts', postData, postConfig)
                .then(res => {
                    console.log(res.data)
                    router.push({ path: '/forum', force: true})
                })
                .catch(err => console.log(err))
                this.writePost = '';
                this.showWriteMessage = false;
                
            } else {
                if (file.size > 2500000) { return this.messageToUser = 'Taille maximale acceptée : 2.5MB'}
                let formData = new FormData();
                formData.append('image', file);
                formData.append('username', username);
                formData.append('content', this.writePost);
                axios.post('http://localhost:3000/api/posts', formData, postConfig)
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => console.log(err))
                router.push({ path: '/forum', force: true})
                this.writePost = '';
                this.showWriteMessage = false;
            }
        },
        modifyPost() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const postData = { content: this.post.content }
            const index = this.$route.params.id
            axios.put(`http://localhost:3000/api/posts/${index}`, postData, postConfig)
            .then(res => {
                console.log(res.data)
                this.showEditPost = false
            })
            .catch(err => console.log(err))
        },
        deletePost() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const postId = this.$route.params.id
            if (this.post.imgURL != null) {
                axios.delete(`http://localhost:3000/api/posts/${postId}`, postConfig)
                .then(res => {
                    console.log(res)
                })
                .catch(err => console.log(err))
                router.push({ path: `/${username}`, force: true })
            } else {
                axios.delete(`http://localhost:3000/api/posts/${postId}`, postConfig)
                .then(() => {
                    router.push({ path: `/${username}`, force: true })
                })
                .catch(err => console.log(err))
            }
        },
        createComment() {
            if (this.enableComment == false) return alert('Veuillez écrire un commentaire')
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const id = this.$route.params.id;
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const postData = { 
                id: id,
                username: username,
                userId: userId,
                content: this.writeComment
            };
            axios.post('http://localhost:3000/api/comments', postData, postConfig)
            .then(res => {
                console.log(res)
                this.getComments()
                this.writeComment = ''
            }).catch(err => console.log(err))
        },
        modifyComment() {
            this.status = 'toEdit'
        },
        confirmCommentChanges(commentId) {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const postData = { content: this.editComment }
            axios.put(`http://localhost:3000/api/comments/${commentId}`, postData, postConfig)
            .then(res => {
                console.log(res.data)
                this.status = '';
                this.editComment = '';
                this.getComments();
            })
            .catch(err => console.log(err))
        },
        deleteComment(commentId) {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            axios.delete(`http://localhost:3000/api/comments/${commentId}`, postConfig)
            .then(res => {
                console.log(res)
                this.$router.go()
                this.getComments()
            })
            .catch(err => console.log(err))
        },
        logout() {
            sessionStorage.clear();
            router.push({ path: '/'})
        },
        goToProfile() {
            const username = JSON.parse(sessionStorage.getItem('username'))
            router.push({ path: `/${username}`})
        }
    }
}

const Profile = {
    template: '#profile',
    name: 'Profile',
    data() {
        return {
            role: '',
            writeContent: '',
            showWriteMessage: false,
            showEditProfile: false,
            messageToUser: '',
            user: [{
                userId: '',
                username: '',
                bio: '',
                imgURL: ''
            }],
            posts: [{
                username: '',
                userIMG: '',
                updatedAt: '',
                content: '',
                imgURL: '',
                userId: '',
                id: ''
            }]
        }
    },
    created() {
        this.getUser()
        this.getUserPosts()
    },
    computed: {
        enablePost() {
            if (this.writeContent != '') return true;
            else return false
        }
    },
    methods: {
        getUser() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const userRole = JSON.parse(sessionStorage.getItem('userRole'))
            const username = this.$route.params.username
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (userRole == 'admin') this.role = 'superUser';
            axios.get(`http://localhost:3000/api/users/${username}`, postConfig)
            .then(res => {
                this.user = res.data
                if (res.data.userId == userId) this.role = 'profileUser';
                if (this.user.imgURL == null) {
                    this.showEditProfile = true;
                    this.messageToUser = 'Veuillez choisir votre photo profil';
                } else this.showEditProfile = false
            }).catch(err => console.log(err))
        },
        getUserPosts() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = this.$route.params.username
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            axios.get(`http://localhost:3000/api/users/${username}/posts`, postConfig)
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    this.posts[i] = res.data[i];
                    this.posts[i].updatedAt = res.data[i].updatedAt.split('T')[0];
                }
            }).catch(err => console.log(err))
        },
        goToForum() {
            if (this.user.imgURL == null) {
                this.showEditProfile = true;
                this.messageToUser = 'Veuillez choisir votre photo profil';
            }
            else router.push({ path: '/forum' })
        },
        previewFile() {
            const preview = document.querySelector('.post_writing_fields img');
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const reader = new FileReader();
            this.messageToUser = '';
            reader.addEventListener('load', () => {
                preview.classList.remove('hidden')
                preview.src = reader.result;
            }, false);
            if (file) reader.readAsDataURL(file);
            if (file.size > 2500000) return this.messageToUser = 'Taille maximale acceptée : 2.5MB';
        },
        createPost() {
            if (this.enablePost == false) return alert('Veuillez écrire un message')
            const token = JSON.parse(sessionStorage.getItem('token'))
            const username = JSON.parse(sessionStorage.getItem('username'))
            const file = document.querySelector('.post_writing_button input[type=file]').files[0];
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (!file) {
                const postData = { username: username, content: this.writeContent };
                axios.post('http://localhost:3000/api/posts', postData, postConfig)
                .then(res => {
                    console.log(res.data)
                    router.push({path: '/forum'})
                }).catch(err => console.log(err))
                this.writeContent = '';
                this.showWriteMessage = false
            } else {
                if (file.size > 2500000) { return this.messageToUser = 'Taille maximale acceptée : 2.5MB'}
                let formData = new FormData();
                formData.append('image', file);
                formData.append('username', username);
                formData.append('content', this.writeContent);
                axios.post('http://localhost:3000/api/posts', formData, postConfig)
                .then(res => {
                    console.log(res.data)
                }).catch(err => console.log(err))
                this.writeContent = '';
                this.showWriteMessage = false
                router.push({path: '/forum'})
            }
        },
        logout() {
            sessionStorage.clear();
            router.push({ path: '/'})
        },
        previewPicture() {
            const preview = document.querySelector('.profile_editing_fields img');
            const file = document.querySelector('.profile_editing_button input[type=file]').files[0];
            const reader = new FileReader();
            this.messageToUser = '';
            reader.addEventListener('load', () => {
                preview.classList.remove('hidden')
                preview.src = reader.result;
            }, false);
            if (file) reader.readAsDataURL(file);
            if (file.size > 2500000) return this.messageToUser = 'Taille maximale acceptée : 500KB';
        },
        modifyProfile() {
            const token = JSON.parse(sessionStorage.getItem('token'));
            const userId = this.user.userId
            const username = JSON.parse(sessionStorage.getItem('username'));
            const file = document.querySelector('.profile_editing_button input[type=file]').files[0];
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            if (!file) {
                const postData = { bio: this.user.bio, username: username }
                axios.post(`http://localhost:3000/api/users/${userId}`, postData, postConfig)
                .then(res => {
                    console.log(res.data)
                    this.showEditProfile = false;
                }).catch(err => console.log(err))
            } else {
                if (file.size > 500000) return this.messageToUser = 'Taille maximale acceptée : 500KB'
                let formData = new FormData();
                formData.append('image', file, username);
                formData.append('bio', this.user.bio)
                axios.post(`http://localhost:3000/api/users/${userId}`, formData, postConfig)
                .then(res => {
                    console.log(res.data)
                    this.showEditProfile = false;
                }).catch(err => console.log(err.response))
            }
        },
        deleteAccount() {
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = this.user.userId
            const username = this.$route.params.username
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            const result = confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')
            if(result) {
                //Récupérer tous les POSTS du USER
                axios.get(`http://localhost:3000/api/users/${username}/posts`, postConfig)
                .then(res => {
                    if (res.data.length != null) {
                        for (let i = 0; i < res.data.length; i++) {
                            //Supprimer chacun des POSTS
                            axios.delete(`http://localhost:3000/api/posts/${res.data[i].id}`, postConfig)
                            .then(res => console.log(res.data.message))
                            .catch(err => console.log(err))
                        }
                        axios.delete(`http://localhost:3000/api/users/${userId}`, postConfig)
                        .then(res => console.log(res.data.message))
                        .catch(err => console.log(err))
                    }
                    else if (res.data.length == null) {
                        //Supprimer le USER (y compris tous ses likes & dislikes et commentaires)
                        axios.delete(`http://localhost:3000/api/users/${userId}`, postConfig)
                        .then(res => console.log(res.data.message))
                        .catch(err => console.log(err))
                    }
                }).catch(err => console.log(err))
                sessionStorage.clear();
                router.push({ path: '/', force: true })
            }
        },
        goToProfile() {
            const username = JSON.parse(sessionStorage.getItem('username'))
            router.push({ path: `/${username}`, force: true})
            const token = JSON.parse(sessionStorage.getItem('token'))
            const userId = JSON.parse(sessionStorage.getItem('userId'))
            const userRole = JSON.parse(sessionStorage.getItem('userRole'))
            const postConfig = { headers: { 'Authorization': `Bearer ${token}` }}
            axios.get(`http://localhost:3000/api/users/${username}`, postConfig)
            .then(res => {
                this.user = res.data
                console.log(res.data)
                if (res.data.userId == userId || userRole == 'admin') this.role = 'profileUser';
                axios.get(`http://localhost:3000/api/users/${username}/posts`, postConfig)
                .then(res => {
                    if (res.data.length == 0) {this.$router.go()}
                    else {
                        this.$router.go()
                        for (let i = 0; i < res.data.length; i++) {
                            this.posts[i] = res.data[i];
                            this.posts[i].updatedAt = res.data[i].updatedAt.split('T')[0];
                        }
                    }
                }).catch(err => console.log(err))
            }).catch(err => console.log(err));
        }
    }
}

const routes = [
    { path: '/', name: 'login', component: Login },
    { path: '/forum', name: 'forum', component: Forum },
    { path: '/forum/:id', name: 'post', component: Post },
    { path: '/:username', name: 'profile', component: Profile }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(), //Provide history implementation to use
    routes //short for 'routes: routes'
})

const app = Vue.createApp({});

app.use(router);
app.mount('#app');