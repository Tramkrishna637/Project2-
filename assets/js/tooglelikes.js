class ToggleLike {
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        let self = this;

        $(this.toggler).click(function(e){
            // VERY IMPORTANT: Prevent the browser's default GET navigation
            e.preventDefault(); 

            // Get the URL from the href attribute
            let url = $(this).attr('href'); // 'this' inside the click handler refers to the clicked element

            $.ajax({
                type: 'POST', // Explicitly set the request type to POST
                url: url,     // Use the URL from the href
            })
            .done(function(data) {
                let likesCount = parseInt($(self.toggler).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                }else{
                    likesCount += 1;
                }

                $(self.toggler).attr('data-likes', likesCount);
                $(self.toggler).html(`${likesCount} Likes`);

            })
            .fail(function(errData) {
                console.log('error in completing the request', errData);
            });
        });
    }
}

