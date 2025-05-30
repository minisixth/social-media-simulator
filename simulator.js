$(document).ready(function () {
  let currentPlatform = "facebook";
  const defaultProfilePic = "./pic/profile_default.jpg";
  const transparentPixel =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const today = new Date();
  const formattedDate = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;
  let initialContent = $("#post-content").val();
  $("#post-content").val(
    initialContent.replace("{current_date}", formattedDate)
  );

  $("#profile-pic-display").attr("src", defaultProfilePic);
  $("#post-image-display").attr("src", transparentPixel).css("opacity", 0.3);
  $(".profile-pic-preview").attr("src", defaultProfilePic);
  $(".post-image-preview-in-post").attr("src", transparentPixel).hide();

  function getPlatformPrefix(platform) {
    if (platform === "facebook") return "fb";
    if (platform === "twitter") return "tw";
    if (platform === "threads") return "th";
    return "";
  }

  function updateVerifiedBadge(platformPrefix, usernameVal) {
    const isVerified =
      /verified/i.test(usernameVal) ||
      usernameVal === "範例使用者" ||
      usernameVal === "Elon Musk";
    const badgeColor =
      platformPrefix === "fb"
        ? "text-primary"
        : platformPrefix === "tw"
        ? "text-sky-400"
        : "text-primary";
    const badgeSvg = `<svg viewBox="0 0 22 22" fill="currentColor" class="verified-badge ${badgeColor} inline-block" xmlns="http://www.w3.org/2000/svg"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.706-1.084-1.245-1.438-.54-.354-1.17-.552-1.817-.57-.647-.017-1.275.215-1.816.57-.54.354-.972.852-1.246 1.438-.607-.223-1.264-.27-1.897-.14-.634-.131-1.218.437-1.687.882-.445-.47-1.053-.75-1.687.882-.13.633-.083-1.29.14 1.897-.587.273-1.084.706-1.438 1.245-.354-.54-.552 1.17-.57 1.817.017.647.215 1.275.57 1.816.354.54.852.972 1.438 1.246-.223-.607-.27 1.264-.14 1.897.131-.634-.437-1.218-.882 1.687-.47-.445-1.053-.75 1.687.882.633.13 1.29.083 1.897-.14.273.587.706 1.084 1.245 1.438.54.354 1.17.552 1.817.57.647.017 1.275-.215 1.816-.57.54-.354.972.852 1.246-1.438.607.223 1.264.27 1.897.14.634-.131 1.218.437 1.687-.882-.445-.47 1.053-.75 1.687.882.13-.633-.083-1.29-.14-1.897.587.273 1.084-.706 1.438-1.245.354-.54.552-1.17.57-1.817zm-4.545-3.13l-6.99 6.99-3.267-3.268a1.002 1.002 0 111.417-1.416l1.85 1.85 5.574-5.573a1.002 1.002 0 011.416 1.417z"></path></g></svg>`;
    const usernameElement = $(`#${platformPrefix}-username`);
    usernameElement.text(usernameVal);
    //if (isVerified) {
    //  usernameElement.append(badgeSvg);
    //}
  }

  function updatePreview() {
    const usernameVal = $("#username").val();
    const useridVal = $("#userid").val();
    const postContentRaw = $("#post-content").val();
    const postTimeVal = $("#post-time").val();
    const viewsVal = parseInt($("#views").val()) || 0;
    const likesVal = parseInt($("#likes").val()) || 0;
    const commentsVal = parseInt($("#comments").val()) || 0;
    const sharesVal = parseInt($("#shares").val()) || 0;

    let postContentFormatted = $("<div/>").text(postContentRaw).html();
    postContentFormatted = postContentFormatted.replace(
      /#([\p{L}\p{N}_]+)/gu,
      '<span class="hashtag">#$1</span>'
    );
    postContentFormatted = postContentFormatted.replace(
      /@(([a-zA-Z0-9_.-]|[^\x00-\x7F])+)/g,
      '<span class="mention">@$1</span>'
    );
    postContentFormatted = postContentFormatted.replace(/\n/g, "<br>");

    const platformPrefix = getPlatformPrefix(currentPlatform);

    updateVerifiedBadge(platformPrefix, usernameVal);
    $(`#${platformPrefix}-post-time`).text(postTimeVal);
    $(`#${platformPrefix}-post-content`).html(postContentFormatted);

    if (currentPlatform === "facebook") {
      $(`#fb-likes-count-val`).text(formatNumber(likesVal));
      $(`#fb-comments-count-val`).text(`${formatNumber(commentsVal)}則留言`);
      $(`#fb-shares-count-val`).text(`${formatNumber(sharesVal)}次分享`);
      $(`#fb-views-count-val`).text(`${formatNumber(viewsVal)}次瀏覽`);
    } else if (currentPlatform === "twitter") {
      $(`#tw-userid`).text(useridVal);
      $(`#tw-comments-count .count-val`).text(formatNumber(commentsVal));
      $(`#tw-shares-count .count-val`).text(formatNumber(sharesVal));
      $(`#tw-likes-count .count-val`).text(formatNumber(likesVal));
      $(`#tw-views-count .count-val`).text(formatNumber(viewsVal));
    } else if (currentPlatform === "threads") {
      let threadsStatsHtml = `${formatNumber(commentsVal)} 則回覆 <span class="stat-separator">·</span> ${formatNumber(likesVal)} 個讚`;
      const sharesText = `${formatNumber(sharesVal)} 次轉發`;
      const viewsText = `${formatNumber(viewsVal)} 次查看`;

      // Only add shares and views if they have a value, to keep it cleaner if not used
      // And ensure the new spans are visible
      if (sharesVal > 0 || $("#shares").val() !== "0") { // Check input value too in case of 0
        threadsStatsHtml += ` <span class="stat-separator">·</span> <span id="th-shares-count-val">${sharesText}</span>`;
        $("#th-shares-count").show(); // Ensure the container span is visible
      } else {
        $("#th-shares-count").hide();
      }

      if (viewsVal > 0 || $("#views").val() !== "0") {
        threadsStatsHtml += ` <span class="stat-separator">·</span> <span id="th-views-count-val">${viewsText}</span>`;
        $("#th-views-count").show(); // Ensure the container span is visible
      } else {
        $("#th-views-count").hide();
      }
      
      // It seems I added th-shares-count and th-views-count as main containers in HTML.
      // Let's adjust to populate them directly if they are meant to be individual items.
      // Original HTML for Threads stats:
      // <span id="th-comments-count"></span> <span class="stat-separator">·</span> <span id="th-likes-count"></span>
      // New HTML:
      // ... <span id="th-shares-count"></span> <span id="th-views-count"></span>
      // The JS should populate these spans directly.

      $(`#th-comments-count`).text(`${formatNumber(commentsVal)} 則回覆`);
      $(`#th-likes-count`).text(`${formatNumber(likesVal)} 個讚`);

      if (sharesVal > 0 || $("#shares").val() !== "" && parseInt($("#shares").val()) !== 0) {
        $("#th-shares-count").html(`<span class="stat-separator">·</span> ${sharesText}`).show();
      } else {
        $("#th-shares-count").hide().empty();
      }

      if (viewsVal > 0 || $("#views").val() !== "" && parseInt($("#views").val()) !== 0) {
        $("#th-views-count").html(`<span class="stat-separator">·</span> ${viewsText}`).show();
      } else {
        $("#th-views-count").hide().empty();
      }
    }
  }

  function switchPlatform(platform) {
    currentPlatform = platform;
    const platformPrefix = getPlatformPrefix(platform);

    $("#preview-area")
      .removeClass("facebook-theme twitter-theme threads-theme")
      .addClass(platform + "-theme");
    $(
      "#facebook-post-preview, #twitter-post-preview, #threads-post-preview"
    ).hide();
    $("#" + platform + "-post-preview").show();

    if (platform === "twitter") {
      $("#shares-label").text("轉發數");
      $("#userid-container").removeClass("hidden-input-container");
    } else {
      $("#userid-container").addClass("hidden-input-container");
      if (platform === "facebook") $("#shares-label").text("分享數");
      else if (platform === "threads") $("#shares-label").text("轉發/引用數");
    }

    const currentProfilePicSrc = $("#profile-pic-display").attr("src");
    $(`#${platformPrefix}-profile-pic`).attr("src", currentProfilePicSrc);

    const currentPostImageSrc = $("#post-image-display").attr("src");
    const postImageElement = $(`#${platformPrefix}-post-image`);
    if (
      currentPostImageSrc !== transparentPixel &&
      $("#post-image").val() !== ""
    ) {
      postImageElement.attr("src", currentPostImageSrc).show();
    } else {
      postImageElement.attr("src", transparentPixel).hide();
    }
    updatePreview();
  }

  $(".platform-select").change(function () {
    switchPlatform($(this).val());
  });

  function imageToBase64(fileInputId, displayImgId, type) {
    const file = $(fileInputId)[0].files[0];
    const platformPrefix = getPlatformPrefix(currentPlatform);

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target.result;
        $(displayImgId).attr("src", base64String).css("opacity", 1);
        if (type === "profile") {
          $(`#${platformPrefix}-profile-pic`).attr("src", base64String);
        } else if (type === "post") {
          $(`#${platformPrefix}-post-image`).attr("src", base64String).show();
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (type === "profile") {
        $(displayImgId).attr("src", defaultProfilePic);
        $(`#${platformPrefix}-profile-pic`).attr("src", defaultProfilePic);
      } else if (type === "post") {
        $(displayImgId).attr("src", transparentPixel).css("opacity", 0.3);
        $(`#${platformPrefix}-post-image`).attr("src", transparentPixel).hide();
      }
    }
  }

  $("#profile-pic").change(function () {
    imageToBase64("#profile-pic", "#profile-pic-display", "profile");
  });

  $("#post-image").change(function () {
    imageToBase64("#post-image", "#post-image-display", "post");
  });

  $("#set-current-time").click(function () {
    const now = new Date();
    let timeString = "剛剛";

    if (
      now.getMinutes() === new Date().getMinutes() &&
      now.getHours() === new Date().getHours() &&
      now.getDate() === new Date().getDate()
    ) {
      timeString = "剛剛";
    } else {
      let hours = now.getHours();
      const ampm = hours >= 12 ? "下午" : "上午";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      timeString = `${ampm} ${hours}:${minutes}`;
    }
    $("#post-time").val(timeString).trigger("input");
  });

  $("#set-random-time").click(function () {
    const times = [
      "剛剛",
      "5 分鐘",
      "15 分鐘",
      "1 小時",
      "3 小時",
      "昨天 晚上10:30",
      "5月10日",
      "4月22日 下午3:15",
      "12月25日",
      "2024年1月1日"
    ];
    $("#post-time")
      .val(times[Math.floor(Math.random() * times.length)])
      .trigger("input");
  });

  $("#randomize-stats").click(function () {
    const maxViewsBase = currentPlatform === "twitter" ? 1500000 : 40000;
    const views =
      Math.floor(Math.random() * maxViewsBase) +
      Math.floor(Math.random() * 50000) +
      1000;

    const likesMultiplier =
      currentPlatform === "threads"
        ? 0.5
        : currentPlatform === "facebook"
        ? 0.2
        : 0.1;
    let likes =
      Math.floor(Math.random() * Math.min(views, 200000) * likesMultiplier) +
      Math.floor(Math.random() * 100);
    likes = Math.min(likes, views);

    let comments =
      Math.floor(
        Math.random() * likes * (currentPlatform === "facebook" ? 0.2 : 0.1)
      ) + Math.floor(Math.random() * 20);
    comments = Math.min(comments, views, likes);

    let shares =
      Math.floor(
        Math.random() * comments * (currentPlatform === "twitter" ? 0.3 : 0.5)
      ) + Math.floor(Math.random() * 10);
    shares = Math.min(shares, views, likes, comments);

    $("#views").val(views);
    $("#likes").val(likes);
    $("#comments").val(comments);
    $("#shares").val(shares);
    updatePreview();
  });

  function formatNumber(num) {
    if (isNaN(num)) return "0";
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 10000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    if (num >= 1000) return num.toLocaleString("zh-TW");
    return num.toString();
  }

  $("#download-screenshot").click(function () {
    const previewElement = document.getElementById("post-preview-container");
    const originalBg = $("#preview-area").css("background-color");

    // 添加一個小的延遲，給瀏覽器更多時間渲染
    // 如果問題依然存在，可以嘗試增加延遲時間，例如 500ms 或 1000ms
    setTimeout(function () {
      html2canvas(previewElement, {
        useCORS: true,
        allowTaint: false, // 如果圖片都是 Base64 或同源，可以考慮設為 false
        backgroundColor: originalBg,
        scale: 2,
        logging: true, // 開啟日誌，方便在控制台查看 html2canvas 的處理過程
        onclone: function (clonedDoc) {
          console.log("html2canvas: onclone started.");
          const base = new URL(window.location.href);

          // Helper function to convert relative URL to absolute
          function toAbsoluteURL(url) {
            if (url && !url.startsWith('data:') && !url.startsWith('http') && !url.startsWith('blob:')) {
              try {
                // Create a URL object relative to the document's base URL
                return new URL(url, base).href;
              } catch (e) {
                console.warn(`html2canvas: Could not convert to absolute URL: ${url}`, e);
                return url; // Fallback to original if conversion fails
              }
            }
            return url;
          }

          // Process <img> tags
          $(clonedDoc).find("img").each(function (index, imgElement) {
            const $img = $(imgElement);
            let originalSrc = $img.attr('src');
            if (originalSrc) {
              let absoluteSrc = toAbsoluteURL(originalSrc);
              if (absoluteSrc !== originalSrc) {
                $img.attr('src', absoluteSrc);
                console.log(`html2canvas: Cloned img[${index}] src updated from "${originalSrc ? originalSrc.substring(0,60) : 'null'}" to "${absoluteSrc ? absoluteSrc.substring(0,60) : 'null'}"`);
              } else {
                console.log(`html2canvas: Cloned img[${index}] src (already absolute or data/blob): "${originalSrc ? originalSrc.substring(0,60) : 'null'}"`);
              }
            } else {
               console.log(`html2canvas: Cloned img[${index}] has no src.`);
            }
          });

          // Process elements with background-image, specifically .fb-sprite-icon
          $(clonedDoc).find("*").filter(function() {
            return $(this).css('background-image') !== 'none';
          }).each(function (index, element) {
            const $el = $(element);
            let originalBgImage = $el.css('background-image');
            
            // Extract URL from 'url("...")'
            const urlMatch = originalBgImage.match(/url\("?([^"]+)"?\)/);
            if (urlMatch && urlMatch[1]) {
              let originalUrl = urlMatch[1];
              let absoluteUrl = toAbsoluteURL(originalUrl);

              if (absoluteUrl !== originalUrl) {
                let newBgImage = originalBgImage.replace(originalUrl, absoluteUrl);
                $el.css('background-image', newBgImage);
                console.log(`html2canvas: Element[${index}] bg-image updated from "${originalUrl.substring(0,60)}" to "${absoluteUrl.substring(0,60)}"`);
              } else {
                 console.log(`html2canvas: Element[${index}] bg-image URL (already absolute or data/blob): "${originalUrl.substring(0,60)}"`);
              }

              if ($el.hasClass('fb-sprite-icon')) {
                const currentBgSize = $el.css('background-size');
                $el.css('background-size', currentBgSize && currentBgSize !== '0px 0px' ? currentBgSize : 'auto');
                console.log(`html2canvas: Ensured background-size: ${$el.css('background-size')} for fb-sprite-icon[${index}]`);
              }
            }
          });

          // --- BEGIN SVG POSITIONING FIXES ---

          // 1. Fix for the "globe" icon after the timestamp in Facebook posts
          const fbPostMetaIcon = $(clonedDoc).find('#facebook-post-preview .post-meta .svg-icon');
          if (fbPostMetaIcon.length) {
            // Original CSS: width: 0.8rem; height: 0.8rem; margin-left: 4px;
            // Assuming 1rem = 16px, so 0.8rem = 12.8px. Let's try with 13px or 12px.
            // html2canvas might handle sub-pixel rendering differently.
            fbPostMetaIcon.css({
              'width': '12px', // Explicit px
              'height': '12px', // Explicit px
              'margin-left': '4px', // Already in px, ensure it's applied
              'vertical-align': 'middle' // Ensure consistent vertical alignment
            });
            console.log('html2canvas: Applied explicit styles to FB post meta icon.');
          }

          // 2. Fix for the "like" icon before the like count in Facebook posts
          // This is the SVG with gradients, direct child of the stats div's first child.
          const fbLikeCountIcon = $(clonedDoc).find('#facebook-post-preview .stats > div:first-child > svg');
          if (fbLikeCountIcon.length) {
            // Original HTML: height="18" width="18" class="me-1" style="vertical-align: text-bottom"
            // me-1 is likely 0.25rem (4px) or 0.5rem (8px) margin-right. Let's assume 4px.
            // The `vertical-align: text-bottom` can be tricky.
            fbLikeCountIcon.css({
              'width': '18px', // Already in px via attribute
              'height': '18px', // Already in px via attribute
              'vertical-align': 'middle', // Try a more standard alignment
              'margin-right': '2px', // Explicitly set margin, adjust if needed (original me-1)
              // 'position': 'relative', // Uncomment and adjust 'top' if vertical-align doesn't fix it
              // 'top': '1px'
            });
            console.log('html2canvas: Applied explicit styles to FB like count icon.');
          }
          
          // --- END SVG POSITIONING FIXES ---

          console.log("html2canvas: onclone finished processing URLs and SVG tweaks.");
        }
      })
        .then((canvas) => {
          console.log("html2canvas: Canvas generated successfully.");
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = currentPlatform + "-post-simulated.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log("html2canvas: Image download initiated.");
        })
        .catch(function (error) {
          console.error("html2canvas: Error during canvas generation or download.", error);
          // 在這裡處理錯誤，例如提示使用者截圖失敗
          alert("截圖失敗，請檢查瀏覽器控制台獲取更多資訊。");
        });
    }, 1000); // 增加延遲到 1000 毫秒
  });

  switchPlatform(currentPlatform);
  $("#set-current-time").trigger("click");
  updatePreview();
});
