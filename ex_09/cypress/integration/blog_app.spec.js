

const USERNAME = '__TEST_USER__'
const PASSWORD = 'secret_test1'
const FULLNAME = '__TESTER_NAME__'

const BLOG_gen_blog = (x) => (
    {
        author: "__BLOG_A_" + x + "__",
        url: "__BLOG_U_" + x + "__",
        title: "__BLOG_T_" + x + "__"
    })

const BLOG = [0, 1, 2, 3, 4].map((x) => BLOG_gen_blog(x))

describe('Blog app', function () {

    beforeEach(function () {
        console.log("CLEAR DATABASE")

        localStorage.clear()
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = { name: FULLNAME, username: USERNAME, password: PASSWORD }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })


    it('front page can be opened', function () {
        cy.visit('http://localhost:3000')
        cy.contains('login')
    })

    describe('Login works', () => {
        it('user can log in', function () {

            cy.get('input[name="username"]').type(USERNAME)
            cy.get('input[name="password"]').type(PASSWORD)
            cy.get('button[name="submit"]').click()
            cy.contains(FULLNAME)
        })

        it('login fails with wrong password', function () {
            cy.get('input[name="username"]').type(USERNAME)
            cy.get('input[name="password"]').type(";DROP*")
            cy.get('button[name="submit"]').click()

            cy.get('.msg-error')
                .should('contain', 'Wrong')
            cy.get('html').should('not.contain', FULLNAME)
        })
    })


    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({ username: USERNAME, password: PASSWORD })
        })

        it('logout works', function () {
            cy.contains('__TESTER_NAME__')
            cy.get('button[name="logout"]').click()
            cy.contains('login')
            cy.visit('http://localhost:3000')
            cy.contains('login')
        })

        it('can create new note', () => {
            cy.contains('button', 'new').click()
            cy.contains('button', 'cancel').click()
            cy.contains('button', 'new').click()


            cy.get('input[name="author"]').type(BLOG[0].author)
            cy.get('input[name="btitle"]').type(BLOG[0].title)
            cy.get('input[name="url"]').type(BLOG[0].url)

            cy.contains('button', 'Submit').click()
            cy.get('.msg-info').contains(BLOG[0].title)
            cy.get('#blogs').contains(BLOG[0].title)
        })

        describe('when blogs exists', function () {
            beforeEach(function () {
                cy.addBlog(BLOG[0])
                cy.addBlog(BLOG[1])
                cy.addBlog(BLOG[2])
            })

            it('shows several blogs', () => {
                cy.get('#blogs').should('contain', BLOG[0].title)
                cy.get('#blogs').should('contain', BLOG[1].title)
            })

            it('can hide and show', () => {
                cy.get('#blogs').should('not.contain', BLOG[0].url)
                cy.get('#blogs').contains('button', 'show').click()
                cy.get('#blogs').contains(BLOG[0].url)
                cy.get('#blogs').contains('button', 'hide').click()
                cy.get('#blogs').should('not.contain', BLOG[0].url)
            })

            it('can like blogs', () => {
                cy.get('#blogs').should('not.contain', 'like')
                cy.get('#blogs').contains('button', 'show').click()
                cy.get('#blogs').should('contain', 'like')
                cy.get('#blogs').contains('button', 'like').click()
                cy.get('#blogs').contains('button', 'like').click()
                cy.get('#blogs').should('contain', 'Likes: 2')
            })

            it('can does not delete if not confirm', () => {
                cy.get('#blogs').should('contain', BLOG[0].title)
                cy.get('#blogs').should('not.contain', 'remove')
                cy.get('#blogs').contains('button', 'show').click()
                cy.on('window:confirm', () => (false)).then(() => {
                    cy.get('#blogs').contains('button', 'remove').click()
                    cy.get('#blogs').should('contain', BLOG[0].title)
                })
            })

            it('can doesdelete if  confirm', () => {
                cy.on('window:confirm', () => (true)).then(() => {
                    cy.get('#blogs').should('contain', BLOG[0].title)
                    cy.get('#blogs').contains('button', 'show').click()
                    cy.get('#blogs').contains('button', 'remove').click()
                    cy.get('#blogs').should('not.contain', BLOG[0].title)
                    cy.visit('http://localhost:3000')
                    cy.get('#blogs').should('not.contain', BLOG[0].title)
                    cy.get('#blogs').should('contain', BLOG[1].title)
                })
            })

            it('sorts by likes', () => {

                cy.get('#blogs').contains(BLOG[2].title).contains('button', 'show').click()
                cy.get('#blogs').contains(BLOG[2].title).parents('.blog').contains('button', 'like').click()
                cy.get('#blogs').contains(BLOG[2].title).parents('.blog').contains('button', 'like').click()

                cy.get('#blogs').contains(BLOG[1].title).contains('button', 'show').click()
                cy.get('#blogs').contains(BLOG[1].title).parents('.blog').contains('button', 'like').click()

                // then verify that order is proper
                cy.get('.blog').should('have.length', 3)
                cy.wait(100)
                cy.get('.blog').eq(0).contains(BLOG[2].title)
                cy.get('.blog').eq(1).contains(BLOG[1].title)
                cy.get('.blog').eq(2).contains(BLOG[0].title)
                cy.visit('http://localhost:3000')
                cy.get('.blog').eq(0).contains(BLOG[2].title)
                cy.get('.blog').eq(1).contains(BLOG[1].title)
                cy.get('.blog').eq(2).contains(BLOG[0].title)

            })



        })

    })


})
