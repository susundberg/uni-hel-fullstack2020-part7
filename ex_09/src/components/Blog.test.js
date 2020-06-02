import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { Blog, BlogForm } from './Blog'

import { prettyDOM } from '@testing-library/dom'


describe('Blog form works', () => {

    const mockSubmit = jest.fn()

    const component = render(
        <BlogForm onSubmit={mockSubmit} />
    )

    const form = component.container.querySelector('form')
    const fakeInput = { btitle: "__TITLE__", author: "__AUTHOR__", url: "__URL__" }
    const fakeKeys = Object.keys(fakeInput)
    fakeKeys.map((x) => {
        const found = form.querySelector(`input[name=${x}]`)
        expect(found).toBeDefined()
        return found
    })

    let fakeEvent = {}

    for (let k = 0; k < fakeKeys.length; k++) {
        fakeEvent[ fakeKeys[k] ] = { value: fakeInput[fakeKeys[k]] }
    }


    fireEvent.submit(form, { target: fakeEvent } )

    expect(mockSubmit.mock.calls).toHaveLength(1)
    const call0 = mockSubmit.mock.calls[0]
    expect( call0[0] ).toEqual( fakeInput.btitle )
    expect( call0[1] ).toEqual( fakeInput.author )
    expect( call0[2] ).toEqual( fakeInput.url )

})


describe('Blog item works', () => {

    const user = {
        username: "__USERNAME__", name: "__USER_FULL_NAME__"
    }
    const blog = {
        author: "__AUTHOR__",
        url: " __URL__",
        title: "__TITLE__",
        likes: 0,
        user: user
    }

    const createComp = (onLike, onRemove) => {

        const component = render(
            <Blog blog={blog} onLike={onLike} onRemove={onRemove} user={user} />
        )
        return component
    }

    const clickExpand = (comp) => {
        const button = comp.getByText('show')
        expect(button).toBeDefined()
        fireEvent.click(button)
    }


    test('show_minimal', () => {
        const component = createComp()
        const blogDiv = component.container
        expect(blogDiv).toHaveTextContent(blog.author)
        expect(blogDiv).toHaveTextContent(blog.title)
        expect(blogDiv).not.toHaveTextContent(blog.url)
    })

    test('expand button', () => {
        const component = createComp()
        // console.log(prettyDOM(component.container))
        expect(component.container).not.toHaveTextContent(blog.url)
        clickExpand(component)


        // console.log(prettyDOM(component.container))
        expect(component.container).toHaveTextContent(blog.url)


    })

    test('like button', () => {
        const onLike = jest.fn()

        const comp = createComp(onLike)
        clickExpand(comp)
        const button = comp.getByText('like')
        fireEvent.click(button)
        fireEvent.click(button)
        expect(onLike.mock.calls).toHaveLength(2)
    })
})

