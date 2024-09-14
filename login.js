var loginModule = (function () {
  var signup = function () {
    let email = $("#signup-email").val();
    let name = $("#signup-name").val();
    let password = $("#signup-password").val();
    let country = $("#signup-country").val();
    let social = $("#signup-social").val();

    console.log(email, name, password, country, social);

    //Add validation that email name and password are not empty
    // if (!email || !name || !password) {
    //   alert("Email, Name and Password are required");
    //   return;
    // }

    $.ajax({
      url: "https://app.nocodb.com/api/v2/tables/meyl71rj8uc8xcb/records",
      type: "POST",
      headers: {
        "xc-token": "v659YuW3iQbnASgtnAmWEB_xuaXHX1cs6-V3Sy8B",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        Name: name,
        Email: email,
        Password: password,
        Country: country,
        SocialLink: social,
      }),
      success: function (response) {
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("loggedInUserID", response.Id);
        window.location.href = document.location.origin + "/index.html";
      },
      error: function (response) {
        alert("Signup failed");
      },
    });
  };

  var signin = function () {
    let email = $("#signin-email").val();
    let password = $("#signin-password").val();

    console.log(email, password);

    try {
      $.ajax({
        url:
          "https://app.nocodb.com/api/v2/tables/meyl71rj8uc8xcb/records?offset=0&limit=1&where=(Email%2Ceq%2C" +
          email +
          ")~and(Password%2Ceq%2C" +
          password +
          ")",
        type: "GET",
        headers: {
          "xc-token": "v659YuW3iQbnASgtnAmWEB_xuaXHX1cs6-V3Sy8B",
        },
        success: function (response) {
          console.log(response);
          if (response.list.length > 0) {
            localStorage.setItem("loggedInUser", response.list[0].Name);
            localStorage.setItem("loggedInUserID", response.list[0].Id);
            window.location.href =
              document.location.origin + "/index.html";
          } else {
            alert("Login failed!, Please check your credentials");
          }
        },
      });
    } catch (e) {
      alert("Login failed!, Please check your credentials");
    }
  };

  var addEventListener = function () {
    // $("#signup-button").click(function () {
    //   signup();
    // });
    // $("#signin-button").click(function () {
    //   signin();
    // });

    $("#signup-form").submit(function (e) {
      e.preventDefault();
      signup();
    });

    $("#signin-form").submit(function (e) {
      e.preventDefault();
      signin();
    });
  };

  var init = function () {
    addEventListener();
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  };
  return {
    init: init,
  };
})();

$(document).ready(function () {
  loginModule.init();
});
