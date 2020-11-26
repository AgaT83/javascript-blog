'use strict';
{
  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const correctLink = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const correctArticle = document.querySelector(correctLink);

    /* [DONE] add class 'active' to the correct article */
    correctArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorsSelector = '.post-author',
    // optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector ='.authors';

  const generateTitleLinks = function (customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into html variable */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagClass = function(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

    return optCloudClassPrefix + classNumber;
  };

  const generateTags = function (){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for(let article of articles){
      /* find tags wrapper */
      const wrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const tag = article.getAttribute('data-tags');
      /* split tags into array */
      const tagsArray = tag.split(' ');
      /* START LOOP: for each tag */
      for(let tagItem of tagsArray){
        /* generate HTML of the link */
        const linkTagHtml = '<li><a href="#tag-' + tagItem + '"><span>' + tagItem + '</span></a></li>';
        /* add generated code to html variable */
        html = html + linkTagHtml;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tagItem]){
          /* [NEW] add tag to allTags object */
          allTags[tagItem] = 1;
        } else {
          allTags[tagItem]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      wrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      const tagLinkHTML = '<li><a href="#tag-' + tag + '" ' + 'class="' + calculateTagClass(allTags[tag], tagsParams) + '"> ' + tag + '</a>' + '</li>';
      allTagsHTML += tagLinkHTML;
    /* [NEW] END LOOP: for each tag in allTags: */
    }
    /* [NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  };

  const calculateTagsParams = function(tags){
    const params = {min: 999999, max: 0};

    for(let tag in tags){
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  };

  generateTags();

  const tagClickHandler = function (event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for(let activeTagLink of activeTagLinks){
      /* remove class active */
      activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let hrefTagLink of hrefTagLinks){
      /* add class active */
      hrefTagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function (){
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('.list-horizontal a');
    /* START LOOP: for each link */
    for(let tagLink of tagLinks){
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function (){
    /* [NEW] create a new variable allAuthors with an empty object */
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for(let article of articles){
      /* find author wrapper */
      const wrapper = article.querySelector(optArticleAuthorsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get authors from data-author attribute */
      const author = article.getAttribute('data-author');
      /* generate HTML of the link */
      const linkAuthorHtml = '<a href="#author-' + author + '"><span>' + author + '</span></a>';
      /* add generated code to html variable */
      html = 'by ' + html + linkAuthorHtml;
      /* insert HTML of all the links into the author wrapper */
      wrapper.innerHTML = html;
      /* [NEW] check if this link is NOT already in allAuthors */
      if(!allAuthors[author]){
        /* [NEW] add author to allAuthors object */
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of authors in right column */
    const authorList = document.querySelector(optAuthorsListSelector);
    /* [NEW] create variable for all links HTML code */
    let allAuthorsHTML = '';
    /* [NEW] START LOOP: for each author in allAuthors: */
    for(let author in allAuthors){
      /* [NEW] generate code of a link and add it to allAuthorsHTML */
      const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + ' ' + '(' + allAuthors[author] + ')' + '</a>' + '</li>';
      allAuthorsHTML += authorLinkHTML;
    /* [NEW] END LOOP: for each tag in allTags: */
    }
    /* [NEW] add html from allAuthorsHTML to authorList */
    authorList.innerHTML = allAuthorsHTML;
  };

  generateAuthors();

  const authorClickHandler = function (event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active author link */
    for(let activeAuthorLink of activeAuthorLinks){
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active author link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const hrefAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    for(let hrefAuthorLink of hrefAuthorLinks){
      /* add class active */
      hrefAuthorLink.classList.add('active');
    /* END LOOP: for each found author link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function (){
    /* find all links to authors */
    const authorLinks = document.querySelectorAll('.post-author a');
    /* START LOOP: for each link */
    for(let authorLink of authorLinks){
      /* add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();
}
